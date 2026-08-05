import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('========== GRAPHQL ERROR ==========');
    console.dir(exception, { depth: null });

    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    console.log('INFO:', info?.fieldName);

    const error = this.extractError(exception);

    console.log('EXTRACTED ERROR:', error);

    throw new GraphQLError(error.message, {
      extensions: {
        code: this.getGraphqlCode(error.status),
        status: error.status,
      },
    });
  }

  private extractError(exception: unknown): {
    message: string;
    status: number;
  } {
    // ========================================
    // 1. Plain object / RPC error
    // ========================================

    if (this.isObject(exception)) {
      const status =
        this.toNumber(exception.statusCode) ??
        this.toNumber(exception.status) ??
        500;

      const message =
        this.extractMessage(exception.message) ?? 'Internal server error';

      return {
        message,
        status,
      };
    }

    // ========================================
    // 2. NestJS HttpException
    // ========================================

    if (
      exception &&
      typeof exception === 'object' &&
      'getStatus' in exception &&
      typeof exception.getStatus === 'function'
    ) {
      const status = exception.getStatus();

      const response =
        'getResponse' in exception &&
        typeof exception.getResponse === 'function'
          ? exception.getResponse()
          : undefined;

      let message = 'Internal server error';

      if (this.isObject(response)) {
        const validationMessages = response.message;

        if (Array.isArray(validationMessages)) {
          return {
            message: validationMessages
              .filter(
                (message): message is string => typeof message === 'string',
              )
              .join(', '),
            status,
          };
        }

        message =
          this.extractMessage(response.message) ?? 'Internal server error';
      } else {
        message =
          this.extractMessage(response) ??
          this.extractMessage(
            'message' in exception ? exception.message : undefined,
          ) ??
          'Internal server error';
      }

      return {
        message,
        status,
      };
    }

    // ========================================
    // 3. Normal Error
    // ========================================

    if (exception instanceof Error) {
      return {
        message: exception.message,
        status: 500,
      };
    }

    // ========================================
    // 4. Unknown
    // ========================================

    return {
      message: 'Internal server error',
      status: 500,
    };
  }

  private isObject(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === 'object';
  }

  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);

      return Number.isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
  }

  private extractMessage(message: unknown): string | undefined {
    if (Array.isArray(message)) {
      return message
        .filter((item): item is string => typeof item === 'string')
        .join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return undefined;
  }
  private getGraphqlCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_USER_INPUT';

      case 401:
        return 'UNAUTHENTICATED';

      case 403:
        return 'FORBIDDEN';

      case 404:
        return 'NOT_FOUND';

      case 409:
        return 'CONFLICT';

      case 422:
        return 'UNPROCESSABLE_ENTITY';

      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
