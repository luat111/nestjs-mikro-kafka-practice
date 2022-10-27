import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ToArrayQuery, ToBoolean, ToILikeQuery } from 'src/core/decorators';
import { SpecDTO } from './spec.dto';

export class GetSpecDTO extends PartialType(
  OmitType(SpecDTO, [
    'name',
    'url',
    'cate',
    'specValues',
    'products',
    'defaultForms',
    'createdAt',
    'updatedAt',
    'isFilter',
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
  isFilter: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cate?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  specValues?: string[];

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
