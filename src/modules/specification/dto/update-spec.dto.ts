import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
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
  @IsUUID(null, { each: true })
  @Type(() => String)
  specValues?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  products?: string[];
}
