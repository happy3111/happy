import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BridgeLatencyInput {
  @Field({ nullable: true })
  bridge_src_id: number;

  @Field({ nullable: true })
  bridge_dst_id: number;

  @Field({ nullable: true })
  latency: number;
}
