import { BadRequestException } from '@nestjs/common';

class BadRequest extends BadRequestException {
  constructor(service: string, errorString: string) {
    const message = errorString || 'Something went wrong';
    super(`[${service}] ${message}`);
  }
}

export default BadRequest;
