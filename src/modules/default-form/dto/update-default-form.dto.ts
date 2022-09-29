import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { DefaultFormDTO } from './default-form.dto';

export class UpdateDefaultFormDTO extends OmitType(PartialType(DefaultFormDTO), [
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsUUID(null, { each: true })
  @Type(() => String)
  specs?: string[];

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
  specCates?: string[];
}
