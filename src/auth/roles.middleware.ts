import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { Role } from './role.enum';

export const rolesMiddleware =
  (...roles: Role[]): FieldMiddleware =>
  async (ctx: MiddlewareContext, next: NextFn) => {
    const user = ctx.context.req.user;
    if (!roles.includes(user.role)) {
      throw new ForbiddenException(`Forbidden field ${ctx.info.fieldName}`);
    }
    return next();
  };
