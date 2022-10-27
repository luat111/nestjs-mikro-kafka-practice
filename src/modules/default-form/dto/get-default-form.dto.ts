import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ToArrayQuery, ToILikeQuery } from 'src/core/decorators';
import { UpdateDefaultFormDTO } from './update-default-form.dto';

export class GetDefaultFormDTO extends OmitType(UpdateDefaultFormDTO, [
  'name',
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiPropertyOptional()
  @IsOptional()
  @ToILikeQuery()
  name: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  specs?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  specValues?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ToArrayQuery()
  specCates?: string[];

  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: true, default: 10 })
  @Type(() => Number)
  pageLength: number;
}
