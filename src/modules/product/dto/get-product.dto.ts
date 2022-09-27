import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UpdateProductDTO } from './update-product.dto';

export class GetProductDTO extends OmitType(UpdateProductDTO, [
  'specs',
  'specValues',
  'specCates',
]) {
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
}
