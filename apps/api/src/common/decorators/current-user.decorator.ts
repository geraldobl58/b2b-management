import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/request.interface';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof CurrentUser | undefined,
    ctx: ExecutionContext,
  ): CurrentUser | string => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new Error('User not found in request');
    }

    if (data) {
      const value = user[data];
      return typeof value === 'string' ? value : String(value);
    }
    return user;
  },
);
