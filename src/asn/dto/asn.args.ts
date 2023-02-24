import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ASNArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => AsnFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}
@InputType()
export class AsnFilter {
  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  name: string;
}
