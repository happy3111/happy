import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'datacenter_server ' })
export class DataCenterServerType {
  @Field()
  datacenter_id: number;

  @Field()
  server_id: number;

  @Field()
  rtt: number;
}
