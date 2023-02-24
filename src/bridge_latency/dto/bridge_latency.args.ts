import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class BridgeLatencyArgs {
  @Field(() => Int)
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit = 25;

  @Field(() => BridgeLatencyFilter, { nullable: true })
  filter;

  @Field(() => Boolean)
  exactMatch = false;
}
@InputType()
export class BridgeLatencyFilter {
  @Field({ nullable: true })
  bridge_src_id: string;

  @Field({ nullable: true })
  bridge_dst_id: string;
}
