import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import NotFoundRecordException from '../../core/exceptions/not-found.exception';

import { LoggerService } from '../logger/logger.service';

import { CreateSpecCategoryDTO } from './dto/create-spec-category.dto';
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
    @InjectRepository(SpecCategoryEntity, 'dbLocal')
    private readonly specCateRepo: EntityRepository<SpecCategoryEntity>,
  ) {
    this.logger.setContext(SpecCateService.name);
  }

  async getAll(): Promise<ISpecCateogry[]> {
    try {
      const cates = await this.specCateRepo.findAll();
      throw new HttpBadRequestException(SpecCateService.name, 'asbc');
      return cates;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
      throw new HttpBadRequestException(SpecCateService.name, err);
    }
  }

  async getOne(id: string): Promise<ISpecCateogry> {
    try {
      const cate = await this.specCateRepo.findOne(
        {
          id,
        },
        {
          populate: ['specs', 'products'],
        },
      );

      if (!cate) throw new NotFoundRecordException(id);

      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecCateService.name, err);
    }
  }

  async create(payload: CreateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const cate = this.specCateRepo.create(payload);
      await this.specCateRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecCateService.name, err);
    }
  }

  async update(payload: UpdateSpecCategoryDTO): Promise<ISpecCateogry> {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      wrap(cate).assign({
        ...rest,
      });

      await this.specCateRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecCateService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const cate = await this.getOne(id);
      await this.specCateRepo.removeAndFlush(cate);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecCateService.name, err);
    }
  }
}
