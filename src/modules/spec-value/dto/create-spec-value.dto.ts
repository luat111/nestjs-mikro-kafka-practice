import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class CreateSpecValueDTO extends OmitType(SpecValueDTO, [
  'id',
  'specificaiton',
  'products',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  specificaiton?: string;
}
