import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { ProductDTO } from './product.dto';

export class UpdateProductDTO extends OmitType(PartialType(ProductDTO), [
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
