import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
