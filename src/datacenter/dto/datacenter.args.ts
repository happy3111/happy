import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class DataCenterArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => DataCenterFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}
@InputType()
export class DataCenterFilter {
  @Field({ nullable: true })
  asn_code: string;

  @Field({ nullable: true })
  asn_name: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  ipfix: string;
}
