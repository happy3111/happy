import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './auth.entity';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User)
    private readonly authModel: typeof User,
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('canActivate');
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = ctx.getContext().req;
    const apikey = req.headers.authorization;
    if (!apikey) return false;
    const user = await this.authModel.findOne({ where: { apikey: apikey } });
    if (!user) return false;
    req.user = user;
    if (requiredRoles.length == 0) return true;
    return requiredRoles.some((role) => role == user.role);
  }
}
