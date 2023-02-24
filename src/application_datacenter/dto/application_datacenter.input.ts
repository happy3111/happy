import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApplicationDatacenterInput {
  @Field({ nullable: true })
  application_id: number;

  @Field({ nullable: true })
  datacenter_id: number;
}
