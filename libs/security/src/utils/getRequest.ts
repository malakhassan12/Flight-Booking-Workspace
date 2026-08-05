import { ExecutionContext } from '@nestjs/common';

export async function getRequest(context: ExecutionContext) {
  if (context.getType<'graphql' | 'http'>() === 'graphql') {
    const { GqlExecutionContext } = await import('@nestjs/graphql');
    return GqlExecutionContext.create(context).getContext().req;
  }

  return context.switchToHttp().getRequest();
}
