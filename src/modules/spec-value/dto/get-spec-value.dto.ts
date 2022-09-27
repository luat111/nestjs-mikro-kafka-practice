import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class GetSpecValueDTO extends OmitType(SpecValueDTO, [
  'specificaiton',
  'products',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @ApiProperty()
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
}
