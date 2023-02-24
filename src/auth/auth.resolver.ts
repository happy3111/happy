import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthToken, SigninArgs } from './dto/signin.args';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Roles(Role.Admin)
  @Query(() => [User])
  auths(): Promise<User[]> {
    return this.authService.findAll();
  }

  // @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthToken)
  async signin(@Args('signinArgs') signinArgs: SigninArgs): Promise<AuthToken> {
    const token = await this.authService.signin(signinArgs);
    return token;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @Context() context,
  ): Promise<boolean> {
    console.log(context.req.user);
    // pubSub.publish('authUpdated', { authUpdated: auth });
    await this.authService.update(
      context.req.user.id,
      oldPassword,
      newPassword,
    );
    return true;
  }
}
