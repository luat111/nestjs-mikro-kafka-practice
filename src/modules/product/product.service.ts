import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';

import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import ProductEntity from 'src/entities/product.entity';

import { KafkaService } from '../kafka/kafka.service';
import { LoggerService } from '../logger/logger.service';
import { GetProductDTO } from './dto/get-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProduct, IProductSerivce } from './interface/product.interface';

@Injectable()
export class ProductService implements IProductSerivce {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(ProductEntity, 'dbLocal')
    private readonly productRepoLocal: EntityRepository<ProductEntity>,
    @InjectRepository(ProductEntity, 'dbStaging')
    private readonly productRepoStg: EntityRepository<ProductEntity>,
  ) {
    this.logger.setContext(ProductService.name);
  }

  @UseRequestContext()
  async commit(payload: IProduct | IProduct[]): Promise<void> {
    await this.productRepoLocal.persistAndFlush(payload);
  }

  async onModuleInit() {
    // await this.kafkaService.consume(
    //   {
    //     topics: ['test-topic'],
    //     fromBeginning: true,
    //   },
    //   {
    //     eachMessage: (message: EachMessagePayload) =>
    //       this.handleMessage(message),
    //   },
    // );
  }

  async handleMessage({ topic, partition, message }: EachMessagePayload) {
    console.log(message.value.toString());
  }

  async getOne(id: string): Promise<IProduct> {
    try {
      const product = await this.productRepoLocal.findOne(
        {
          id: id,
        },
        {
          populate: [
            'specCates',
            'specCates.specs',
            'specCates.specs.specValues',
          ],
          populateWhere: {
            specCates: {
              products: id,
            },
            specs: {
              products: id,
            },
            specValues: {
              products: id,
            },
          },
        },
      );
      return product;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(ProductService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getAll(query: GetProductDTO): Promise<IProduct[]> {
    try {
      const products = await this.productRepoLocal.find({ ...query });
      return products;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(ProductService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getAllPublish(query: GetProductDTO): Promise<IProduct[]> {
    try {
      const products = await this.productRepoLocal.find(
        {
          ...query,
        },
        {
          filters: { getPublish: false },
        },
      );
      return products;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(ProductService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async update(payload: UpdateProductDTO): Promise<ProductEntity> {
    try {
      const { id, ...rest } = payload;
      const product = await this.getOne(id);

      const updatedProduct = wrap(product).assign({
        ...rest,
      });

      await this.commit(updatedProduct);

      return updatedProduct;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(ProductService.name, err);
    }
  }

  async syncProduct(): Promise<IProduct[]> {
    try {
      const productStg = await this.productRepoStg.findAll({
        fields: ['id', 'publish'],
        filters: { getPublish: false },
      });

      const productLocal = await this.productRepoLocal.findAll({
        fields: ['id'],
        filters: { getPublish: false },
      });

      const newProduct: ProductEntity[] = productStg.reduce((newArr, p) => {
        if (!productLocal.some((e) => e.id === p.id)) {
          const { id, publish } = p;
          newArr.push(
            this.productRepoLocal.create<ProductEntity>({ id, publish }),
          );
        }
        return newArr;
      }, []);

      await this.productRepoLocal.persistAndFlush(newProduct);

      return newProduct;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(ProductService.name, err);
    }
  }
}
