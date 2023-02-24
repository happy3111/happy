import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'application_datacenter ' })
export class ApplicationDatacenterType {
  @Field()
  datacenter_id: number;

  @Field()
  server_id: number;

  @Field()
  rtt: number;
}
