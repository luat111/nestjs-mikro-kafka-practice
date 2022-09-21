import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import SpecificationEntity from 'src/entities/spec.entity';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(SpecificationEntity, 'dbLocal')
    private readonly specRepository: EntityRepository<SpecificationEntity>,
  ) {}

  async getAll() {
    return this.specRepository.findAll();
  }
}
