import { NotFoundException } from '@nestjs/common';

class ProductNotFoundException extends NotFoundException {
  constructor(productId: string) {
    super(`Not found Product #${productId}`);
  }
}

export default ProductNotFoundException;
