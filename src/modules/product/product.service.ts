import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EachMessagePayload } from 'kafkajs';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import ProductEntity from 'src/entities/product.entity';
import { IDefaultFormService } from '../default-form/interface/default-form.interface';

import { KafkaService } from '../kafka/kafka.service';
import { LoggerService } from '../logger/logger.service';
import { ISpecCategorySerivce } from '../spec-category/interface/spec-category.interface';
import { ISpecValueService } from '../spec-value/interface/spec-value.interface';
import { ISpecificationService } from '../specification/interface/specification.interface';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProduct, IProductSerivce } from './interface/product.interface';

@Injectable()
export class ProductService implements IProductSerivce {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(ProductEntity, 'dbLocal')
    private readonly productRepoLocal: EntityRepository<ProductEntity>,
    @InjectRepository(ProductEntity, 'dbStaging')
    private readonly productRepoStg: EntityRepository<ProductEntity>,
    @Inject(forwardRef(() => 'ISpecificationService'))
    private readonly specService: ISpecificationService,
    @Inject(forwardRef(() => 'ISpecCategorySerivce'))
    private readonly specCateService: ISpecCategorySerivce,
    @Inject(forwardRef(() => 'ISpecValueService'))
    private readonly specValueService: ISpecValueService,
    @Inject('IDefaultFormService')
    private readonly defaultFormService: IDefaultFormService,
  ) {
    this.logger.setContext(ProductService.name);
  }

  @UseRequestContext()
  async commit(payload: IProduct | IProduct[]): Promise<void> {
    await this.productRepoLocal.persistAndFlush(payload);
  }

  async onModuleInit() {
    await this.kafkaService.consume(
      {
        topics: [this.configService.get<string>('kafka.topic')],
        fromBeginning: true,
      },
      {
        eachMessage: (message: EachMessagePayload) =>
          this.handleMessage(message),
      },
    );
  }

  async handleMessage({ message }: EachMessagePayload) {
    try {
      const payloadProduct = JSON.parse(message.value.toString());
      await this.create(payloadProduct);
    } catch (err) {
      this.logger.error(err);
    }
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

      if (!product) throw new NotFoundRecord(id);

      return product;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
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
      throw new BadRequest(ProductService.name, err);
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
      throw new BadRequest(ProductService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateProductDTO): Promise<ProductEntity> {
    try {
      const product = this.productRepoLocal.create(payload);
      await this.commit(product);
      return product;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async update(payload: UpdateProductDTO): Promise<ProductEntity> {
    try {
      const { id, specCates, specValues, specs, ...rest } = payload;
      const product = await this.getOne(id);

      specCates &&
        specCates.length &&
        (await Promise.all(
          specCates.map((cate) => this.specCateService.getOne(cate)),
        ));
      specValues &&
        specValues.length &&
        (await Promise.all(
          specValues.map((value) => this.specValueService.getOne(value)),
        ));
      specs &&
        specs.length &&
        (await Promise.all(specs.map((spec) => this.specService.getOne(spec))));

      const updatedProduct = wrap(product).assign({
        ...rest,
        specs: specs || product.specs,
        specCates: specCates || product.specCates,
        specValues: specValues || product.specValues,
      });

      await this.commit(updatedProduct);

      return updatedProduct;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async cloneSpec(idProduct: string, idDefaultForm: string): Promise<IProduct> {
    try {
      const defaultForm = await this.defaultFormService.getOneRaw(
        idDefaultForm,
      );
      const product = await this.getOne(idProduct);
      const { specCates, specValues, specs } = defaultForm;

      const updatedProduct = wrap(product).assign({
        specs,
        specCates,
        specValues,
      });

      await this.commit(updatedProduct);

      return updatedProduct;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
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
      throw new BadRequest(ProductService.name, err);
    }
  }
}
