import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { DefaultFormDTO } from './default-form.dto';

export class CreateDefaultFormDTO extends OmitType(DefaultFormDTO, [
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  specs?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  specValues?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  specCates?: string[];
}
