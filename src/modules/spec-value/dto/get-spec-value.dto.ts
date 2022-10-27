import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ToArrayQuery, ToBoolean, ToILikeQuery } from 'src/core/decorators';
import { SpecValueDTO } from './spec-value.dto';

export class GetSpecValueDTO extends PartialType(
  OmitType(SpecValueDTO, [
    'name',
    'url',
    'specification',
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
  specification?: string;

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
