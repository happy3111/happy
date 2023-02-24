import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SigninArgs {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType({ description: 'authToken ' })
export class AuthToken {
  @Field()
  token: string;

  @Field()
  expiresAt: number;
}
