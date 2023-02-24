import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FinalBridgeInput {
  @Field({ nullable: true })
  final_id: number;

  @Field({ nullable: true })
  bridges_id: number;

  @Field({ nullable: true })
  latency: number;

  @Field({ nullable: true })
  online: number;
}
