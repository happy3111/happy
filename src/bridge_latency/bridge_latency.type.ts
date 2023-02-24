import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'bridge_latency ' })
export class BridgeLatencyType {
  @Field()
  datacenter_id: number;

  @Field()
  server_id: number;

  @Field()
  rtt: number;
}
