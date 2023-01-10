import { CreateProductDTO } from '../dto/create-product.dto';

export class ProductCreatedEvent {
  id: string;
  name: string;
  uri: string;
  publish: boolean;
  productPhoto: string;
  salePrice: number;
  CategoryId: string;
  
  constructor(payload: CreateProductDTO) {
    for (let key in payload) {
      this[key] = payload[key];
    }
  }
}
