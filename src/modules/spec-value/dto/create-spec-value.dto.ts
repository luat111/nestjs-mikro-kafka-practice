import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class CreateSpecValueDTO extends OmitType(SpecValueDTO, [
  'id',
  'specification',
  'products',
  'defaultForms',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  specification?: string;
}
