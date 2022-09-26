import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SpecDTO } from './spec.dto';
export class UpdateSpecDTO extends OmitType(PartialType(SpecDTO), [
  'specValues',
  'products',
  'cate',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  cate?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
