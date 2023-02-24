import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ApplicationArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => ApplicationFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}

@InputType()
export class ApplicationFilter {
  @Field({ nullable: true })
  category: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  tag: string;

  @Field({ nullable: true })
  os: string;

  @Field({ nullable: true })
  proxy_rules: string;
}
