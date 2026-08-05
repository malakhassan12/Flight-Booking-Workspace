import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {  Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    console.log('From exception filter HTTP');
    console.dir(exception, { depth: null });
    // HTTP Exception
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const error = exception.getResponse();

      if (typeof error === 'string') {
        message = error;
      } else {
        message = (error as any).message ?? error;
      }
    }

    // RpcException Error
    else if (exception?.statusCode) {
      status = exception.statusCode;
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
