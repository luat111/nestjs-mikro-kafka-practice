import { OmitType } from '@nestjs/swagger';
import { SpecDTO } from './spec.dto';

export class CreateSpecDTO extends OmitType(SpecDTO, [
  'id',
  'specValues',
  'products',
  'cate'
]) {}
