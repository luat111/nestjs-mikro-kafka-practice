import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ProductDTO } from './product.dto';

export class CreateProductDTO extends OmitType(ProductDTO, [
  'specs',
  'specValues',
  'specCates',
]) {
  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specs?: string[];

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specValues?: string[];

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  specsCates?: string[];
}
