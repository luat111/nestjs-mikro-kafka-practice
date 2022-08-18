import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import NotFoundRecordException from 'src/core/exceptions/not-found.exception';
import SpecificationEntity from 'src/entities/specification.entity';

import { LoggerService } from '../logger/logger.service';

import { CreateSpecDTO } from './dto/create-spec.dto';
import { UpdateSpecDTO } from './dto/update-spec.dto';
import { ISpecification } from './interface/specification.interface';

@Injectable()
export class SpecificationService {
  constructor(
    @Inject(LoggerService)
    private readonly logger: LoggerService,
    @InjectRepository(SpecificationEntity, 'dbLocal')
    private readonly specRepo: EntityRepository<SpecificationEntity>,
  ) {
    this.logger.setContext(SpecificationService.name);
  }

  async getAll(): Promise<ISpecification[]> {
    try {
      const specs = await this.specRepo.findAll();
      return specs;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async getOne(id: string): Promise<ISpecification> {
    try {
      const cate = await this.specRepo.findOne(
        {
          id,
        },
        {
          populate: ['cate', 'products', 'specValues'],
        },
      );

      if (!cate) throw new NotFoundRecordException(id);

      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async create(payload: CreateSpecDTO): Promise<ISpecification> {
    try {
      const cate = this.specRepo.create(payload);
      await this.specRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async update(payload: UpdateSpecDTO): Promise<ISpecification> {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      wrap(cate).assign({
        ...rest,
      });

      await this.specRepo.persistAndFlush(cate);
      return cate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const cate = await this.getOne(id);
      await this.specRepo.removeAndFlush(cate);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }
}
