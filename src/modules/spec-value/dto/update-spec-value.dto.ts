import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class UpdateSpecValueDTO extends OmitType(PartialType(SpecValueDTO), [
  'specification',
  'products',
  'defaultForms',
  'updatedAt',
  'createdAt',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  specification?: string;

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
