import { ExecutionContext, Injectable } from '@nestjs/common';
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
export class PublicAuthGuard extends GqlAuthGuard {}

@Injectable()
export class PublicAuthOptionalGuard extends GqlAuthGuard {
  handleRequest(_, user) {
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
