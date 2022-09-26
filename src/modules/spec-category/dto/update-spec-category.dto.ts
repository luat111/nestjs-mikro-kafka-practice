import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { SpecCategoryDTO } from './spec-category.dto';

export class UpdateSpecCategoryDTO extends OmitType(
  PartialType(SpecCategoryDTO),
  ['specs', 'products'],
) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  products?: string[];
}