import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UpdateDefaultFormDTO } from './update-default-form.dto';

export class GetDefaultFormDTO extends OmitType(UpdateDefaultFormDTO, [
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

  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: true, default: 10 })
  @Type(() => Number)
  pageLength: number;
}
