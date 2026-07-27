import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  override catch(
    exception: RpcException,
    host: ArgumentsHost,
  ): Observable<any> {
    console.log('RPC FILTER');

    console.dir(exception.getError(), {
      depth: null,
    });

    return throwError(() => exception.getError());
  }
}
