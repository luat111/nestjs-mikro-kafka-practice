import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class UpdateSpecValueDTO extends OmitType(PartialType(SpecValueDTO), [
  'specificaiton',
  'products',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  specificaiton?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
