import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'application_final ' })
export class ApplicationFinalType {
  @Field()
  datacenter_id: number;

  @Field()
  server_id: number;

  @Field()
  rtt: number;
}
