import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ServersArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => ServerFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}
@InputType()
export class ServerFilter {
  @Field({ nullable: true })
  hostname: string;

  @Field({ nullable: true })
  ip: string;

  @Field({ nullable: true })
  ip_version: number;
}
