import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ToArrayQuery, ToBoolean, ToILikeQuery } from 'src/core/decorators';
import { UpdateProductDTO } from './update-product.dto';

export class GetProductDTO extends OmitType(UpdateProductDTO, [
  'name',
  'publish',
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiPropertyOptional()
  @IsOptional()
  @ToILikeQuery()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean()
  publish: boolean;

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
