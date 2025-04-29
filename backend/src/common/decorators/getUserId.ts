import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

// Este decorator usa el usuario añadido en el request mediante el JwtGuard
export const GetUser = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request: IncomingMessage & {
      user?: Record<string, unknown>;
    } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
