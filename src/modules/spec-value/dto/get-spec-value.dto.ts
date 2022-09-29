import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class GetSpecValueDTO extends PartialType(
  OmitType(SpecValueDTO, [
    'name',
    'url',
    'specificaiton',
    'products',
    'createdAt',
    'updatedAt',
  ]),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return { $ilike: `%${value}%` };
  })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return { $ilike: `%${value}%` };
  })
  url: string;

  @ApiPropertyOptional()
  @IsString()
  specificaiton?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value.includes(',')) return value.split(',');
    return [value];
  })
  products?: string[];

  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: true, default: 10 })
  @Type(() => Number)
  pageLength: number;
}
