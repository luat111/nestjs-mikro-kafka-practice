import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { SpecCategoryDTO } from './spec-category.dto';

export class UpdateSpecCategoryDTO extends OmitType(
  PartialType(SpecCategoryDTO),
  ['specs', 'products'],
) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  products?: string[];
}
