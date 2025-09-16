import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { Role } from '@prisma/client';

export interface CurrentUser {
  sub: string;
  email: string;
  role: Role;
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
