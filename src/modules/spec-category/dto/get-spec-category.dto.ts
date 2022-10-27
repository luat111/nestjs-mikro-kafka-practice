import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ToArrayQuery, ToBoolean, ToILikeQuery } from 'src/core/decorators';
import { SpecCategoryDTO } from './spec-category.dto';

export class GetSpecCategoryDTO extends PartialType(
  OmitType(SpecCategoryDTO, [
    'name',
    'url',
    'specs',
    'products',
    'defaultForms',
    'createdAt',
    'updatedAt',
    'isAdvanced',
    'isFilter',
    'hidden',
  ]),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @ToILikeQuery()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ToILikeQuery()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  hidden: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  isAdvanced: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  isFilter: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  specs?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  products?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  defaultForms?: string[];

  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: true, default: 10 })
  @Type(() => Number)
  pageLength: number;
}
