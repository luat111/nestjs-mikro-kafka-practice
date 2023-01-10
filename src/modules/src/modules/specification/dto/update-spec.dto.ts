import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SpecDTO } from './spec.dto';
export class UpdateSpecDTO extends OmitType(PartialType(SpecDTO), [
  'specValues',
  'products',
  'defaultForms',
  'cate',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  cate?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  specValues?: string[];

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
