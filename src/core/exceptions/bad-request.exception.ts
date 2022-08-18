import { BadRequestException } from '@nestjs/common';

class HttpBadRequestException extends BadRequestException {
  constructor(service: string, errorString: string) {
    const message = errorString || 'Something went wrong';
    super(`[${service}] ${message}`);
  }
}

export default HttpBadRequestException;
