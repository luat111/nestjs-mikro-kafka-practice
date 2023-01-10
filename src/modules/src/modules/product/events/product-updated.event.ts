import { UpdateProductDTO } from "../dto/update-product.dto";

export class ProductUpdatedEvent {
  id: string;
  name: string;
  uri: string;
  publish: boolean;
  productPhoto: string;
  salePrice: number;
  CategoryId: string;

  constructor(payload: UpdateProductDTO) {
    for (let key in payload) {
      this[key] = payload[key];
    }
  }
}
