import { MikroORM, UseRequestContext, wrap } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import DefaultFormEntity from 'src/entities/default-form.entity';

import { KafkaService } from '../kafka/kafka.service';
import { LoggerService } from '../logger/logger.service';
import { CreateDefaultFormDTO } from './dto/create-default-form.dto';
import { GetDefaultFormDTO } from './dto/get-default-form.dto';
import { UpdateDefaultFormDTO } from './dto/update-default-form.dto';
import {
  IDefaultForm,
  IDefaultFormSerivce,
} from './interface/default-form.interface';

@Injectable()
export class DefaultFormService implements IDefaultFormSerivce {
  constructor(
    private readonly logger: LoggerService,
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(DefaultFormEntity, 'dbLocal')
    private readonly defaultFormRepo: EntityRepository<DefaultFormEntity>,
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
          populate: [
            'specCates',
            'specCates.specs',
            'specCates.specs.specValues',
          ],
          populateWhere: {
            specCates: {
              defaultForms: id,
            },
            specs: {
              defaultForms: id,
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

  async getAll(query: GetDefaultFormDTO): Promise<IDefaultForm[]> {
    try {
      const defaultForms = await this.defaultFormRepo.find({ ...query });
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
      const { id, ...rest } = payload;
      const defaultForm = await this.getOne(id);

      const updatedDefaultForm = wrap(defaultForm).assign({
        ...rest,
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
