import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ProductDTO } from './product.dto';

export class UpdateProductDTO extends OmitType(PartialType(ProductDTO), [
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specs?: string[];
  
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specValues?: string[];
  
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  specCates?: string[];
}
