import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: keyof any | undefined, context: ExecutionContext) => {
    let request;

    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      request = GqlExecutionContext.create(context).getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
