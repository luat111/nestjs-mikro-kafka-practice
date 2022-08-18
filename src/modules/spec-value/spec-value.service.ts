import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import NotFoundRecordException from 'src/core/exceptions/not-found.exception';
import SpecValueEntity from 'src/entities/spec-value.entity';

import { LoggerService } from '../logger/logger.service';

import { CreateSpecValueDTO } from './dto/create-spec-value.dto';
import { UpdateSpecValueDTO } from './dto/update-spec-value.dto';
import {
  ISpecValue,
  ISpecValueService,
} from './interface/spec-value.interface';

@Injectable()
export class SpecValueService implements ISpecValueService {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
    @InjectRepository(SpecValueEntity, 'dbStaging')
    private readonly specValueRepo: EntityRepository<SpecValueEntity>,
  ) {
    this.logger.setContext(SpecValueService.name);
  }

  async getAll(): Promise<ISpecValue[]> {
    try {
      const specs = await this.specValueRepo.findAll();
      return specs;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
      throw new HttpBadRequestException(SpecValueService.name, err);
    }
  }

  async getOne(id: string): Promise<ISpecValue> {
    try {
      const cate = await this.specValueRepo.findOne(
        {
          id,
        },
        {
          populate: ['specificaiton', 'products'],
        },
      );

      if (!cate) throw new NotFoundRecordException(id);

      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecValueService.name, err);
    }
  }

  async create(payload: CreateSpecValueDTO): Promise<ISpecValue> {
    try {
      const cate = this.specValueRepo.create(payload);
      await this.specValueRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecValueService.name, err);
    }
  }

  async update(payload: UpdateSpecValueDTO): Promise<ISpecValue> {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      wrap(cate).assign({
        ...rest,
      });

      await this.specValueRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecValueService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const cate = await this.getOne(id);
      await this.specValueRepo.removeAndFlush(cate);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecValueService.name, err);
    }
  }
}
