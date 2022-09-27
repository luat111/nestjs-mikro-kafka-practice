import { OmitType } from '@nestjs/swagger';
import { ProductDTO } from './product.dto';

export class CreateProductDTO extends OmitType(ProductDTO, [
  'specs',
  'specValues',
  'specCates',
]) {}
