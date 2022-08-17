import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import { CreateSpecCategoryDTO } from './dto/create-spec-category.dto';
import { UpdateSpecCategoryDTO } from './dto/update-spec-category.dto';
import NotFoundRecordException from '../../core/exceptions/not-found.exception';
import { ISpecCategorySerivce } from './interface/spec-category.interface';

@Injectable()
export class SpecCateService implements ISpecCategorySerivce {
  serviceName = 'SpecCategoryService';
  constructor(
    @InjectRepository(SpecCategoryEntity, 'dbLocal')
    private readonly specCateRepo: EntityRepository<SpecCategoryEntity>,
  ) {}

  async getAll() {
    try {
      const cates = await this.specCateRepo.findAll();
      return cates;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  async getOne(id: string) {
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
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  async create(payload: CreateSpecCategoryDTO) {
    try {
      const cate = this.specCateRepo.create(payload);
      const newCate = await this.specCateRepo.persistAndFlush(cate);
      return newCate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  async update(payload: UpdateSpecCategoryDTO) {
    try {
      const { id, ...rest } = payload;
      const cate = await this.getOne(id);

      wrap(cate).assign({
        ...rest,
      });

      const newCate = await this.specCateRepo.persistAndFlush(cate);
      return newCate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  async remove(id: string) {
    try {
      const cate = await this.getOne(id);
      return await this.specCateRepo.removeAndFlush(cate);
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }
}
