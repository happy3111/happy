import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

@Injectable()
export class JwtAuthGuard extends GqlAuthGuard {
  // canActivate(context: ExecutionContext): boolean {
  //   const req = this.getRequest(context);
  //   console.log('hey!', Object.keys(req));
  //   const user = req.user;
  //   if(user && !user.email)
  //     return true;
  //   else
  //     return false;
  // }

  handleRequest(err, user) {
    if (err || !user || !user.id) {
      throw err || new ForbiddenException('Forbidden resource');
    }
    return user;
  }
}

@Injectable()
export class JwtAuthOptionalGuard extends GqlAuthGuard {
  handleRequest(err, user) {
    return user;
  }
}

// function createParamDecorator(arg0: (data: unknown, context: ExecutionContext) => any) {
//     throw new Error('Function not implemented.');
// }

// export const CurrentUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req.user;
//   },
// );
