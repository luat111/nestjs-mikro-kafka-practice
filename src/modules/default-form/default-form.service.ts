import {
  MikroORM,
  PopulateHint,
  UseRequestContext,
  wrap,
} from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import DefaultFormEntity from 'src/entities/default-form.entity';

import { LoggerService } from '../logger/logger.service';
import { ISpecCategorySerivce } from '../spec-category/interface/spec-category.interface';
import { ISpecValueService } from '../spec-value/interface/spec-value.interface';
import { ISpecificationService } from '../specification/interface/specification.interface';
import { CreateDefaultFormDTO } from './dto/create-default-form.dto';
import { GetDefaultFormDTO } from './dto/get-default-form.dto';
import { UpdateDefaultFormDTO } from './dto/update-default-form.dto';
import {
  IDefaultForm,
  IDefaultFormService,
} from './interface/default-form.interface';

@Injectable()
export class DefaultFormService implements IDefaultFormService {
  constructor(
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(DefaultFormEntity, 'dbLocal')
    private readonly defaultFormRepo: EntityRepository<DefaultFormEntity>,
    @Inject(forwardRef(() => 'ISpecificationService'))
    private readonly specService: ISpecificationService,
    @Inject(forwardRef(() => 'ISpecCategorySerivce'))
    private readonly specCateService: ISpecCategorySerivce,
    @Inject(forwardRef(() => 'ISpecValueService'))
    private readonly specValueService: ISpecValueService,
  ) {
    this.logger.setContext(DefaultFormService.name);
  }

  @UseRequestContext()
  async commit(payload: IDefaultForm | IDefaultForm[]): Promise<void> {
    await this.defaultFormRepo.persistAndFlush(payload);
  }

  async getOne(id: string): Promise<IDefaultForm> {
    try {
      const defaultForm = await this.defaultFormRepo.findOne(
        {
          id: id,
          specCates: {
            $or: [
              { defaultForms: id },
              {
                specs: {
                  specValues: {
                    defaultForms: id,
                  },
                },
              },
            ],
          },
        },
        {
          populate: ['specCates.specs.specValues'],
          populateWhere: PopulateHint.INFER,
        },
      );

      if (!defaultForm) throw new NotFoundRecord(id);

      return defaultForm;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOneRaw(id: string): Promise<IDefaultForm> {
    try {
      const defaultForm = await this.defaultFormRepo.findOne({
        id: id,
      });

      if (!defaultForm) throw new NotFoundRecord(id);

      return defaultForm;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getAll(query: GetDefaultFormDTO): Promise<IDefaultForm[]> {
    try {
      const { page, pageLength, ...rest } = query;
      const defaultForms = await this.defaultFormRepo.find(
        { ...rest },
        {
          offset: (page - 1) * pageLength,
          limit: pageLength,
        },
      );
      return defaultForms;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getAllPublish(query: GetDefaultFormDTO): Promise<IDefaultForm[]> {
    try {
      const defaultForms = await this.defaultFormRepo.find(
        {
          ...query,
        },
        {
          filters: { getPublish: false },
        },
      );
      return defaultForms;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateDefaultFormDTO): Promise<DefaultFormEntity> {
    try {
      const defaultForm = this.defaultFormRepo.create(payload);
      await this.commit(defaultForm);
      return defaultForm;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    }
  }

  async update(payload: UpdateDefaultFormDTO): Promise<DefaultFormEntity> {
    try {
      const { id, specCates, specValues, specs, ...rest } = payload;
      const defaultForm = await this.getOne(id);

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

      const updatedDefaultForm = wrap(defaultForm).assign({
        ...rest,
        specs: specs || defaultForm.specs,
        specCates: specCates || defaultForm.specCates,
        specValues: specValues || defaultForm.specValues,
      });

      await this.commit(updatedDefaultForm);

      return updatedDefaultForm;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const spec = await this.getOne(id);
      await this.defaultFormRepo.removeAndFlush(spec);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    }
  }
}
