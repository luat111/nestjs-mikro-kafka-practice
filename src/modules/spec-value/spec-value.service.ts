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
import SpecValueEntity from 'src/entities/spec-value.entity';

import { LoggerService } from '../logger/logger.service';
import { IProductSerivce } from '../product/interface/product.interface';
import { ISpecificationService } from '../specification/interface/specification.interface';
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
    @InjectMikroORM('dbLocal')
    private readonly orm: MikroORM,
    @InjectRepository(SpecValueEntity, 'dbLocal')
    private readonly specValueRepo: EntityRepository<SpecValueEntity>,
    @Inject(forwardRef(() => 'ISpecificationService'))
    private readonly specService: ISpecificationService,
    @Inject('IProductService')
    private readonly productService: IProductSerivce,
  ) {
    this.logger.setContext(SpecValueService.name);
  }

  @UseRequestContext()
  async commit(payload: ISpecValue | ISpecValue[]): Promise<void> {
    await this.commit(payload);
  }

  async getAll(): Promise<ISpecValue[]> {
    try {
      const specValues = await this.specValueRepo.findAll();
      return specValues;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecValueService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async getOne(id: string): Promise<ISpecValue> {
    try {
      const specValue = await this.specValueRepo.findOne(
        {
          id,
        },
        {
          populate: ['specification', 'products'],
        },
      );

      if (!specValue) throw new NotFoundRecord(id);

      return specValue;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecValueService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async create(payload: CreateSpecValueDTO): Promise<ISpecValue> {
    try {
      const { specificaiton } = payload;

      await this.specService.getOne(specificaiton);

      const specValue = this.specValueRepo.create(payload);
      await this.commit(specValue);
      return specValue;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecValueService.name, err);
    }
  }

  async update(payload: UpdateSpecValueDTO): Promise<ISpecValue> {
    try {
      const { id, specificaiton, products, ...rest } = payload;
      const specValue = await this.getOne(id);

      specificaiton && (await this.specService.getOne(specificaiton));
      products.length &&
        (await Promise.all(
          products.map((pId) => this.productService.getOne(pId)),
        ));

      const updatedSpecValue = wrap(specValue).assign({
        ...rest,
      });

      await this.commit(updatedSpecValue);
      return updatedSpecValue;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecValueService.name, err);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const specValue = await this.getOne(id);
      await this.specValueRepo.removeAndFlush(specValue);
      return 'Delete successed';
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(SpecValueService.name, err);
    }
  }
}
