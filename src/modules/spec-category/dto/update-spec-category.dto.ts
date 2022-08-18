import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { SpecCategoryDTO } from './spec-category.dto';

export class UpdateSpecCategoryDTO extends OmitType(
  PartialType(SpecCategoryDTO),
  ['specs', 'products'],
) {
  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
