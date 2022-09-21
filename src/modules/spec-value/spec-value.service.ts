import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import SpecificationValueEntity from 'src/entities/spec_value.entity';

@Injectable()
export class SpecificationValueService {
  constructor(
    @InjectRepository(SpecificationValueEntity, 'dbLocal')
    private readonly specValueRepository: EntityRepository<SpecificationValueEntity>,
  ) {}

  async getAll() {
    return this.specValueRepository.findAll();
  }

  async getByIds(specIds: string[]): Promise<SpecificationValueEntity[]> {
    try {
      const specValues = await this.specValueRepository.find(
        {
          id: { $in: specIds },
        },
        {
          populate: ['specificaiton', 'specificaiton.cate'],
        },
      );

      return specValues;
    } catch {
      return [];
    }
  }
}
