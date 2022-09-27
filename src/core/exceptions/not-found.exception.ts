import { NotFoundException } from '@nestjs/common';

class NotFoundRecord extends NotFoundException {
  constructor(id: string) {
    super(`Not found record #${id}`);
  }
}

export default NotFoundRecord;
