import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class HostingCompanyArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => HostingCompanyFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}
@InputType()
export class HostingCompanyFilter {
  @Field({ nullable: true })
  company_name: string;
}
