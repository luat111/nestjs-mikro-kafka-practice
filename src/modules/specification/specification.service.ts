import {
  EntityRepository,
  MikroORM,
  UseRequestContext,
  wrap
} from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';

import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
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
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(SpecificationEntity, 'dbLocal')
    private readonly specRepo: EntityRepository<SpecificationEntity>,
  ) {
    this.logger.setContext(SpecificationService.name);
  }

  @UseRequestContext()
  async commit(payload: ISpecification | ISpecification[]): Promise<void> {
    await this.specRepo.persistAndFlush(payload);
  }

  async getAll(): Promise<ISpecification[]> {
    try {
      const specs = await this.specRepo.findAll();
      return specs;
    } catch (err) {
      this.logger.error(err.response.message || err.message);
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
          populate: ['cate', 'products', 'specValues'],
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
      const spec = this.specRepo.create(payload);
      await this.specRepo.persistAndFlush(spec);
      return spec;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecificationService.name, err);
    }
  }

  async update(payload: UpdateSpecDTO): Promise<ISpecification> {
    try {
      const { id, ...rest } = payload;
      const spec = await this.getOne(id);

      wrap(spec).assign({
        ...rest,
      });

      await this.specRepo.persistAndFlush(spec);
      return spec;
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
