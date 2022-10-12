import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SpecDTO } from './spec.dto';

export class CreateSpecDTO extends OmitType(SpecDTO, [
  'id',
  'specValues',
  'products',
  'defaultForms',
  'cate',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  cate?: string;
}
