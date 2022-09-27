import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class UpdateSpecValueDTO extends OmitType(PartialType(SpecValueDTO), [
  'specificaiton',
  'products',
  'updatedAt',
  'createdAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  specificaiton?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  products?: string[];
}
