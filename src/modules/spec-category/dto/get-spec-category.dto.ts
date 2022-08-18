import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional } from 'class-validator';
import { SpecCategoryDTO } from './spec-category.dto';

export class GetSpecCategoryDTO extends OmitType(SpecCategoryDTO, [
  'specs',
  'products',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
