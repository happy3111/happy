import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'application_icon ' })
export class ApplicationIconType {
  @Field()
  datacenter_id: number;

  @Field()
  server_id: number;

  @Field()
  rtt: number;
}
