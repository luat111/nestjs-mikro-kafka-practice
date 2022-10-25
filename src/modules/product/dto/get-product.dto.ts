import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UpdateProductDTO } from './update-product.dto';

export class GetProductDTO extends OmitType(UpdateProductDTO, [
  'name',
  'publish',
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return { $ilike: `%${value}%` };
  })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  publish: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value.includes(',')) return value.split(',');
    return [value];
  })
  specs?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value.includes(',')) return value.split(',');
    return [value];
  })
  specValues?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value.includes(',')) return value.split(',');
    return [value];
  })
  specCates?: string[];

  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: true, default: 10 })
  @Type(() => Number)
  pageLength: number;
}
