import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { SpecDTO } from './spec.dto';

export class GetSpecDTO extends OmitType(SpecDTO, [
  'cate',
  'specValues',
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
  cate?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
