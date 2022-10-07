import { OmitType } from '@nestjs/swagger';
import { SpecCategoryDTO } from './spec-category.dto';

export class CreateSpecCategoryDTO extends OmitType(SpecCategoryDTO, [
  'id',
  'specs',
  'products',
  'defaultForms',
  'createdAt',
  'updatedAt',
]) {}
