import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PrefixInput {
  @Field({ nullable: true })
  datacenter_id: number;

  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  ip_range_ini: number;

  @Field({ nullable: true })
  ip_range_end: number;
}
