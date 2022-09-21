import { EntityManager, Loaded } from '@mikro-orm/core';
import { InjectEntityManager, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import ProductEntity from 'src/entities/product.entity';
import { SpecificationValueService } from '../spec-value/spec-value.service';
import { AddSpecDTO, ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity, 'dbStaging')
    private readonly productRepository: EntityRepository<ProductEntity>,
    @InjectRepository(ProductEntity, 'dbLocal')
    private readonly productRepositoryLocal: EntityRepository<ProductEntity>,
    @InjectEntityManager('dbLocal')
    private readonly entityManager: EntityManager,
    @Inject(SpecificationValueService)
    private readonly specValueService: SpecificationValueService,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    try {
      const products = this.productRepository.find({});
      return products;
    } catch {
      return [];
    }
  }

  async getOneRaw(id: string) {
    try {
      const product = await this.productRepositoryLocal.findOne(
        { id },
        {
          populate: ['specs.cate', 'specCates', 'specValues.specificaiton'],
        },
      );

      return this.formatSpecs(product);
    } catch {
      return null;
    }
  }

  async getOne(id: string) {
    try {
      const product = await this.productRepositoryLocal.findOne(
        { id },
        {
          populate: ['specs', 'specCates', 'specValues'],
        },
      );

      return product;
    } catch {
      return null;
    }
  }

  async create(productData: ProductDTO) {
    const product = this.productRepositoryLocal.create(productData);

    await this.productRepositoryLocal.persistAndFlush(product);
    return product;
  }

  async bulkCreate(): Promise<boolean> {
    const forkedEntityManager = this.entityManager.fork();
    await forkedEntityManager.begin();

    try {
      const products = await this.getAll();
      await Promise.all(
        products.map(async (p) => {
          const { id, publish } = p;
          const newProduct = await this.create({
            id,
            publish,
          });
          return newProduct;
        }),
      );
      await forkedEntityManager.commit();
    } catch (err) {
      forkedEntityManager.rollback();
      return false;
    } finally {
      this.entityManager.flush();
      return true;
    }
  }

  async addSpec(payload: AddSpecDTO) {
    try {
      const { productId, idSpecs } = payload;
      const product = await this.getOne(productId);
      const specValues = await this.specValueService.getByIds(idSpecs);

      await Promise.all(
        specValues.map((spec) => {
          product.specValues.add(spec);
          product.specs.add(spec.specificaiton);
          product.specCates.add(spec.specificaiton.cate);
        }),
      );
      this.productRepositoryLocal.persistAndFlush(product);

      return true;
    } catch (err) {
      console.log(err);

      return false;
    }
  }

  formatSpecs(product: Loaded<ProductEntity>) {
    try {
      const p = {
        ...product,
        specs: product.specs.toArray() as any,
        specCates: product.specCates.toArray() as any,
        specValues: product.specValues.toArray() as any,
      };

      p.specs = p.specValues.map((value) => {
        const spec = p.specs.find((spec) => spec.id === value.specificaiton.id);
        const newValue = { id: value.id, name: value.name };
        if (spec.specValues) {
          spec.specValues = [...spec.specValues, newValue];
          return spec;
        }

        spec.specValues = [newValue];

        return spec;
      });

      p.specCates = p.specs.map((spec) => {
        const cate = p.specCates.find((cate) => cate.id === spec.cate.id);
        const newSpec = {
          id: spec.id,
          name: spec.name,
          values: spec.specValues,
        };
        if (cate.specs) {
          cate.specs = [...cate.specs, newSpec];
          return cate;
        }

        cate.specs = [newSpec];

        return cate;
      });

      delete p.specValues;
      delete p.specs;

      return p;
    } catch (err) {
      console.log(err);
    }
  }
}
