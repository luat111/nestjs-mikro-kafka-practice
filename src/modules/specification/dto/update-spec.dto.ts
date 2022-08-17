import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { SpecDTO } from './spec.dto';
export class UpdateSpecDTO extends OmitType(PartialType(SpecDTO), [
  'specValues',
  'products',
  'cate',
]) {
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
