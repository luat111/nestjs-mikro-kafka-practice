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
import { List } from 'src/core/interfaces';
import SpecificationEntity from 'src/entities/specification.entity';
import { IDefaultFormService } from '../default-form/interface/default-form.interface';

import { LoggerService } from '../logger/logger.service';
import { IProductSerivce } from '../product/interface/product.interface';
import { ISpecCategorySerivce } from '../spec-category/interface/spec-category.interface';
import { ISpecValueService } from '../spec-value/interface/spec-value.interface';

import { CreateSpecDTO } from './dto/create-spec.dto';
import { GetSpecDTO } from './dto/get-spec.dto';
import { UpdateSpecDTO } from './dto/update-spec.dto';
import { ISpecification } from './interface/specification.interface';

@Injectable()
export class SpecificationService {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(SpecificationEntity, 'dbLocal')
    private readonly specRepo: EntityRepository<SpecificationEntity>,
    @Inject(forwardRef(() => 'ISpecCategorySerivce'))
    private readonly specCateService: ISpecCategorySerivce,
    @Inject(forwardRef(() => 'ISpecValueService'))
    private readonly specValueService: ISpecValueService,
    @Inject('IProductService')
    private readonly productService: IProductSerivce,
    @Inject(forwardRef(() => 'IDefaultFormService'))
    private readonly defaultFormService: IDefaultFormService,
  ) {
    this.logger.setContext(SpecificationService.name);
  }

  @UseRequestContext()
  async commit(payload: ISpecification | ISpecification[]): Promise<void> {
    await this.specRepo.persistAndFlush(payload);
  }

  async getAll(query: GetSpecDTO): Promise<List<ISpecification>> {
    try {
      const { page, pageLength, ...rest } = query;
      const [specs, count] = await this.specRepo.findAndCount(
        {
          ...rest,
        },
        {
          populate: ['cate'],
          offset: (page - 1) * pageLength,
          limit: pageLength,
        },
      );
      return {
        rows: specs,
        count,
        totalPage: count < pageLength ? 1 : Math.floor(count / pageLength),
      };
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getFilter(): Promise<ISpecification[]> {
    try {
      const specs = await this.specRepo.find(
        {
          isFilter: true,
        },
        {
          populate: ['specValues'],
          populateWhere: {
            specValues: {
              isFilter: true,
            },
          },
        },
      );
      return specs;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOne(id: string): Promise<ISpecification> {
    try {
      const spec = await this.specRepo.findOne(
        {
          id,
        },
        {
          populate: ['cate', 'products', 'specValues', 'defaultForms'],
        },
      );

      if (!spec) throw new NotFoundRecord(id);

      return spec;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateSpecDTO): Promise<ISpecification> {
    try {
      const { cate } = payload;
      const specCate = await this.specCateService.getOne(cate);
      const spec = this.specRepo.create(payload);
      await this.commit(spec);
      return wrap(spec).assign({ cate: specCate }, { em: this.orm.em });
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    }
  }

  async update(payload: UpdateSpecDTO): Promise<ISpecification> {
    try {
      const { id, cate, products, specValues, defaultForms, ...rest } = payload;
      const spec = await this.getOne(id);

      cate && this.specCateService.getOne(cate);

      specValues &&
        specValues.length &&
        (await Promise.all(
          specValues.map(
            async (valueId) => await this.specValueService.getOne(valueId),
          ),
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

      const updatedSpec = wrap(spec).assign({
        ...rest,
        cate: cate || spec.cate,
        specValues: specValues || spec.specValues,
        products: products || spec.products,
        defaultForms: defaultForms || spec.defaultForms,
      });

      await this.commit(updatedSpec);
      return await this.getOne(id);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const spec = await this.getOne(id);
      await this.specRepo.removeAndFlush(spec);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    }
  }
}
