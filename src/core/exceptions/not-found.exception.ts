import { NotFoundException } from '@nestjs/common';

class NotFoundRecordException extends NotFoundException {
  constructor(id: string) {
    super(`Not found record #${id}`);
  }
}

export default NotFoundRecordException;
