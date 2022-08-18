import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { SpecValueDTO } from './spec-value.dto';

export class UpdateSpecValueDTO extends OmitType(PartialType(SpecValueDTO), [
  'specificaiton',
  'products',
]) {
  @ApiProperty()
  @IsString()
  specificaiton?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  products?: string[];
}
