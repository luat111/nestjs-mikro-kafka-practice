import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { SpecCategoryDTO } from './spec-category.dto';

export class UpdateSpecCategoryDTO extends OmitType(
  PartialType(SpecCategoryDTO),
  ['specs', 'products', 'defaultForms', 'createdAt', 'updatedAt'],
) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  specs?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  products?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  defaultForms?: string[];
}
