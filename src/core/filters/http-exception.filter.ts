import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

interface IValidation {
  status: number;
  message: string;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const message = exception.message;
    const statusCode = exception.getStatus();
    const validateMessage = exception.getResponse() as IValidation;
    const response = host.switchToHttp().getResponse<FastifyReply>();

    response.send({
      status: false,
      code: statusCode,
      message:
        validateMessage.message ||
        message ||
        'Something went wrong',
    });
  }
}
