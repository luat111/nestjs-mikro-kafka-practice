import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import CategorySpecificationEntity from 'src/entities/spec_category.entity';

@Injectable()
export class SpecificationCategoryService {
  constructor(
    @InjectRepository(CategorySpecificationEntity, 'dbLocal')
    private readonly specCateogryRepository: EntityRepository<CategorySpecificationEntity>,
  ) {}

  async getAll() {
    return this.specCateogryRepository.findAll()
  }
}
