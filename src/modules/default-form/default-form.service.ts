import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import { List } from 'src/core/interfaces';
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
        },
        {
          populate: ['specCates.specs.specValues', 'specs', 'specValues'],
          populateWhere: {
            specCates: {
              $or: [
                { defaultForms: id },
                {
                  specs: {
                    $or: [
                      { defaultForms: id },
                      {
                        specValues: {
                          defaultForms: id,
                        },
                      },
                    ],
                  },
                },
              ],
            },
            specValues: {
              defaultForms: id,
            },
          },
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
      const defaultForm = await this.defaultFormRepo.findOne(
        {
          id: id,
        },
        { fields: ['specs', 'specCates', 'specValues'] },
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

  async getAll(query: GetDefaultFormDTO): Promise<List<IDefaultForm>> {
    try {
      const { page, pageLength, ...rest } = query;
      const [defaultForms, count] = await this.defaultFormRepo.findAndCount(
        { ...rest },
        {
          offset: (page - 1) * pageLength,
          limit: pageLength,
        },
      );
      return {
        rows: defaultForms,
        count,
        totalPage:
          count % pageLength !== 0
            ? Math.floor(count / pageLength) + 1
            : Math.floor(count / pageLength),
      };
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
      let { id, specCates, specValues, specs, ...rest } = payload;
      const defaultForm = await this.getOne(id);

      if (specCates && specCates.length) {
        await Promise.all(
          specCates.map((cate) => this.specCateService.getOne(cate)),
        );

        for (const spec of defaultForm.specs) {
          if (!specCates.includes(spec.cate.id)) {
            for (const specValue of defaultForm.specValues) {
              if (specValue.specification.id === spec.id) {
                defaultForm.specValues.remove(specValue);
              }
            }
            defaultForm.specs.remove(spec);
          }
        }
      }

      if (specs && specs.length) {
        await Promise.all(
          specs.map(async (spec) => {
            const specRecord = await this.specService.getOne(spec);
            if (
              defaultForm.specCates
                .toArray()
                .every((cate) => cate.id !== specRecord.cate.id) &&
              !(specCates && !specCates.includes(spec))
            )
              specs = specs.filter((e) => e !== spec);

            return specRecord;
          }),
        );

        for (const specValue of defaultForm.specValues) {
          if (!specs.includes(specValue.specification.id)) {
            defaultForm.specValues.remove(specValue);
          }
        }
      }

      specValues &&
        specValues.length &&
        (await Promise.all(
          specValues.map(async (value) => {
            const specValue = await this.specValueService.getOne(value);
            if (
              !defaultForm.specs
                .toArray()
                .some((spec) => spec.id === specValue.specification.id) &&
              !(specs && specs.includes(value))
            )
              specValues = specValues.filter((e) => e !== value);

            return specValue;
          }),
        ));

      const updatedDefaultForm = wrap(defaultForm).assign({
        ...rest,
        specs: specs || defaultForm.specs.toArray().map((spec) => spec.id),
        specCates:
          specCates || defaultForm.specCates.toArray().map((cate) => cate.id),
        specValues:
          specValues ||
          defaultForm.specValues.toArray().map((value) => value.id),
      });

      await this.commit(updatedDefaultForm);

      return await this.getOne(id);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const form = await this.getOne(id);
      await this.defaultFormRepo.removeAndFlush(form);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(DefaultFormService.name, err);
    }
  }
}
