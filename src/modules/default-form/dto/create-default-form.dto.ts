import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { DefaultFormDTO } from './default-form.dto';

export class CreateDefaultFormDTO extends OmitType(DefaultFormDTO, [
  'id',
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specValues?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specCates?: string[];
}
