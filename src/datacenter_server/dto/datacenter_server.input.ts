import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DataCenterServerInput {
  @Field({ nullable: true })
  datacenter_id: number; // int(11) DEFAULT NULL,

  @Field({ nullable: true })
  server_id: number; // int(11) DEFAULT NULL,

  @Field({ nullable: true })
  rtt: number;
}
