import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import { List } from 'src/core/interfaces';
import CategoryEntity from 'src/entities/categories';
import ProductEntity from 'src/entities/product.entity';
import { IDefaultFormService } from '../default-form/interface/default-form.interface';
import { ElasticSearchService } from '../elasticsearch/elasticsearch.service';

import { LoggerService } from '../logger/logger.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProduct, IProductSerivce } from './interface/product.interface';
@Injectable()
export class ProductService implements IProductSerivce {
  constructor(
    // private readonly kafkaService: KafkaService,
    // private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(ProductEntity, 'dbLocal')
    private readonly productRepoLocal: EntityRepository<ProductEntity>,
    @InjectRepository(ProductEntity, 'dbStaging')
    private readonly productRepoStg: EntityRepository<ProductEntity>,
    @InjectRepository(CategoryEntity, 'dbLocal')
    private readonly cateRepoLocal: EntityRepository<CategoryEntity>,
    @InjectRepository(CategoryEntity, 'dbStaging')
    private readonly cateRepoStg: EntityRepository<CategoryEntity>,
    @Inject('IDefaultFormService')
    private readonly defaultFormService: IDefaultFormService,
    private readonly elasticsearchService: ElasticSearchService,
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
    //     topics: [this.configService.get<string>('kafka.topic')],
    //     fromBeginning: true,
    //   },
    //   {
    //     eachMessage: (message: EachMessagePayload) =>
    //       this.handleMessage(message),
    //   },
    // );
  }

  async handleMessage({ message }: EachMessagePayload) {
    try {
      const payloadProduct = JSON.parse(message.value.toString());
      await this.create(payloadProduct);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getOne(id: string): Promise<any> {
    try {
      const product = await this.productRepoLocal.findOne(
        {
          id: id,
        },
        {
          populate: ['specCates', 'specs', 'specValues'],
          orderBy: {
            specCates: {
              indexPos: 'asc',
              createdAt: 'asc',
            },
          },
        },
      );

      if (!product) throw new NotFoundRecord(id);

      const raw = wrap(product, true).toJSON();

      raw.specs = raw.specs.map((spec) => {
        spec.specValues = raw.specValues
          .filter((value) => {
            return String(value.specification) === spec.id;
          })
          .sort((a, b) => a.indexPos - b.indexPos);

        return spec;
      });

      raw.specCates = raw.specCates.map((cate) => {
        cate.specs = raw.specs
          .filter((spec) => String(spec.cate) === cate.id)
          .sort((a, b) => a.indexPos - b.indexPos);

        return cate;
      });

      return raw;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOneRaw(id: string): Promise<IProduct> {
    try {
      const product = await this.productRepoLocal.findOne(
        {
          id: id,
        },
        {
          populate: ['specCates', 'specs', 'specValues'],
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

  async getAll(query: GetProductDTO): Promise<List<IProduct>> {
    try {
      const { page, pageLength, search, ...rest } = query;

      if (search) {
        Object.assign(rest, {
          $or: [
            { uri: { $ilike: `%${search}%` } },
            { name: { $ilike: `%${search}%` } },
          ],
        });
      }

      const [products, count] = await this.productRepoLocal.findAndCount(
        {
          ...rest,
        },
        { offset: pageLength * (page - 1), limit: pageLength },
      );

      return {
        rows: products,
        count,
        totalPage:
          count % pageLength !== 0
            ? Math.floor(count / pageLength) + 1
            : Math.floor(count / pageLength),
      };
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
      await this.elasticsearchService.indexOne({
        ...payload,
        id: product.id,
      });
      return product;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async update(payload: UpdateProductDTO): Promise<ProductEntity> {
    try {
      let { id, specCates, specValues, specs, ...rest } = payload;
      const product = await this.getOneRaw(id);

      if (specCates) {
        for (const spec of product.specs) {
          if (!specCates.includes(spec.cate.id)) {
            for (const specValue of product.specValues) {
              if (specValue.specification.id === spec.id) {
                product.specValues.remove(specValue);
              }
            }
            product.specs.remove(spec);
          }
        }
      }

      if (specs) {
        for (const specValue of product.specValues) {
          if (!specs.includes(specValue.specification.id)) {
            product.specValues.remove(specValue);
          }
        }
      }

      const updatedProduct = wrap(product).assign({
        ...rest,
        specs: specs || product.specs.toArray().map((spec) => spec.id),
        specCates:
          specCates || product.specCates.toArray().map((cate) => cate.id),
        specValues:
          specValues || product.specValues.toArray().map((value) => value.id),
      });

      await this.commit(updatedProduct);

      const { name, uri, productPhoto, publish, CategoryId } = payload;

      if (
        name ||
        uri ||
        productPhoto ||
        CategoryId ||
        publish !== product.publish
      ) {
        await this.elasticsearchService.updateIndex({
          id,
          name: payload.name || product.name,
          uri: payload.uri || product.uri,
          productPhoto: payload.productPhoto || product.productPhoto,
          publish: payload.publish || product.publish,
          CategoryId: payload.CategoryId || product.CategoryId.id,
        });
      }

      return await this.getOne(id);
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
      const product = await this.getOneRaw(idProduct);
      const { specCates, specValues, specs } = defaultForm;

      const updatedProduct = wrap(product).assign({
        specs: specs.toArray().map((spec) => spec.id),
        specCates: specCates.toArray().map((cate) => cate.id),
        specValues: specValues.toArray().map((value) => value.id),
      });

      await this.commit(updatedProduct);

      return await this.getOne(idProduct);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async cloneSpecBySubCate(idSubCate: string, idDefaultForm: string) {
    try {
      const defaultForm = await this.defaultFormService.getOneRaw(
        idDefaultForm,
      );
      const { specCates, specValues, specs } = defaultForm;

      const productIds = (
        await this.productRepoStg.find(
          {
            subCates: {
              SubCategoryId: idSubCate,
            },
          },
          {
            fields: ['id'],
          },
        )
      ).map((e) => e.id);

      const products = await this.productRepoLocal.find({
        id: productIds,
      });

      const wrapProducts = products.map((p) =>
        wrap(p).assign({
          specs: specs.toArray().map((spec) => spec.id),
          specCates: specCates.toArray().map((cate) => cate.id),
          specValues: specValues.toArray().map((value) => value.id),
        }),
      );

      await this.commit(wrapProducts);

      return await this.productRepoLocal.find({
        id: productIds,
      });
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async syncProduct(): Promise<boolean> {
    try {
      const productStg = await this.productRepoStg.findAll({
        fields: [
          'id',
          'name',
          'uri',
          'publish',
          'productPhoto',
          'CategoryId',
          'salePrice',
        ],
        filters: { getPublish: false },
      });

      const newProducts = await Promise.all(
        productStg.map(
          async ({
            id,
            name,
            uri,
            publish,
            productPhoto,
            CategoryId,
            salePrice,
          }) => {
            const p = await this.productRepoLocal.findOne({ id });
            if (p) {
              return wrap(p).assign({
                id,
                name,
                uri,
                publish,
                productPhoto,
                CategoryId,
                salePrice,
              });
            } else {
              return this.productRepoLocal.create({
                id,
                name,
                uri,
                publish,
                productPhoto,
                CategoryId,
              });
            }
          },
        ),
      );

      await this.productRepoLocal.persistAndFlush(newProducts);

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }

  async syncCate(): Promise<boolean> {
    try {
      const cateStg = await this.cateRepoStg.findAll();

      const newCates = await Promise.all(
        cateStg.map(async ({ products, id, ...rest }) => {
          const p = await this.cateRepoLocal.findOne({ id });
          if (p) {
            return wrap(p).assign({
              ...rest,
            });
          } else {
            return this.cateRepoLocal.create({
              ...rest,
              id,
            });
          }
        }),
      );

      await this.cateRepoLocal.persistAndFlush(newCates);

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ProductService.name, err);
    }
  }
}
