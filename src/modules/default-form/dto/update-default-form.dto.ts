import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { DefaultFormDTO } from './default-form.dto';

export class UpdateDefaultFormDTO extends OmitType(
  PartialType(DefaultFormDTO),
  ['specs', 'specValues', 'specCates'],
) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  specs?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  specValues?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  specCates?: string[];
}
