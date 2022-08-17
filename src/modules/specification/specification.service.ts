import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import NotFoundRecordException from 'src/core/exceptions/not-found.exception';
import SpecificationEntity from 'src/entities/specification.entity';
import { LoggerService } from '../logger/logger.service';
import { CreateSpecDTO } from './dto/create-spec.dto';
import { UpdateSpecDTO } from './dto/update-spec.dto';

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

  async getAll() {
    try {
      const cates = await this.specRepo.findAll();
      return cates;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async getOne(id: string) {
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

  async create(payload: CreateSpecDTO) {
    try {
      const cate = this.specRepo.create(payload);
      const newCate = await this.specRepo.persistAndFlush(cate);
      return newCate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async update(payload: UpdateSpecDTO) {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      wrap(cate).assign({
        ...rest,
      });

      const newCate = await this.specRepo.persistAndFlush(cate);
      return newCate;
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }

  async remove(id: string) {
    try {
      const cate = await this.getOne(id);
      return await this.specRepo.removeAndFlush(cate);
    } catch (err) {
      this.logger.error(err);
      throw new HttpBadRequestException(SpecificationService.name, err);
    }
  }
}
