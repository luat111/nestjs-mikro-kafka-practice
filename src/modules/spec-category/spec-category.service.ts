import {
  EntityRepository,
  MikroORM,
  UseRequestContext,
  wrap,
} from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import SpecCategoryEntity from 'src/entities/spec-category.entity';

import { LoggerService } from '../logger/logger.service';
import { IProductSerivce } from '../product/interface/product.interface';
import { ISpecificationService } from '../specification/interface/specification.interface';

import { List } from 'src/core/interfaces';
import { IDefaultFormService } from '../default-form/interface/default-form.interface';
import { CreateSpecCategoryDTO } from './dto/create-spec-category.dto';
import { GetSpecCategoryDTO } from './dto/get-spec-category.dto';
import { UpdateSpecCategoryDTO } from './dto/update-spec-category.dto';
import {
  ISpecCategorySerivce,
  ISpecCateogry,
} from './interface/spec-category.interface';

@Injectable()
export class SpecCateService implements ISpecCategorySerivce {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(SpecCategoryEntity, 'dbLocal')
    private readonly specCateRepo: EntityRepository<SpecCategoryEntity>,
    @Inject('IProductService')
    private readonly productService: IProductSerivce,
    @Inject(forwardRef(() => 'ISpecificationService'))
    private readonly specService: ISpecificationService,
    @Inject(forwardRef(() => 'IDefaultFormService'))
    private readonly defaultFormService: IDefaultFormService,
  ) {
    this.logger.setContext(SpecCateService.name);
  }

  @UseRequestContext()
  async commit(payload: ISpecCateogry | ISpecCateogry[]): Promise<void> {
    await this.specCateRepo.persistAndFlush(payload);
  }

  async getAll(query: GetSpecCategoryDTO): Promise<List<ISpecCateogry>> {
    try {
      const { page, pageLength, ...rest } = query;
      const [cates, count] = await this.specCateRepo.findAndCount(
        { ...rest },
        {
          offset: (page - 1) * pageLength,
          limit: pageLength,
        },
      );
      return {
        rows: cates,
        count,
        totalPage:
          count % pageLength !== 0
            ? Math.floor(count / pageLength) + 1
            : Math.floor(count / pageLength),
      };
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getFilter(): Promise<ISpecCateogry[]> {
    try {
      const cates = await this.specCateRepo.find(
        {
          isFilter: true,
        },
        {
          populate: ['specs'],
          populateWhere: {
            specs: {
              isFilter: true,
            },
          },
        },
      );
      return cates;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOne(id: string): Promise<ISpecCateogry> {
    try {
      const cate = await this.specCateRepo.findOne(
        {
          id,
        },
        {
          populate: ['specs', 'products', 'defaultForms'],
        },
      );

      if (!cate) throw new NotFoundRecord(id);

      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const cate = this.specCateRepo.create(payload);
      await this.commit(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }

  async update(payload: UpdateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const { id, specs, products, defaultForms, ...rest } = payload;
      const cate = await this.getOne(id);

      specs &&
        (await Promise.all(
          specs.map(async (specId) => await this.specService.getOne(specId)),
        ));

      products &&
        products.length &&
        (await Promise.all(
          products.map(async (pId) => await this.productService.getOne(pId)),
        ));

      defaultForms &&
        defaultForms.length &&
        (await Promise.all(
          defaultForms.map(
            async (pId) => await this.defaultFormService.getOne(pId),
          ),
        ));

      const updatedCate = wrap(cate).assign({
        ...rest,
        specs: specs || cate.specs.toArray().map((spec) => spec.id),
        products: products || cate.products.toArray().map((prod) => prod.id),
        defaultForms:
          defaultForms || cate.defaultForms.toArray().map((form) => form.id),
      });

      await this.commit(cate);
      return updatedCate;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const cate = await this.getOne(id);
      await this.specCateRepo.removeAndFlush(cate);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecCateService.name, err);
    }
  }
}
