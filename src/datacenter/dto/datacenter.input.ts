import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DataCenterInput {
  @Field({ nullable: true })
  asn_id: number; // int(11) DEFAULT NULL,

  @Field({ nullable: true })
  city_id: number; // int(11) DEFAULT NULL,

  @Field({ nullable: true })
  ipfix: string;

  @Field({ nullable: true })
  port: number;

  @Field({ nullable: true })
  protocol: string;

  @Field({ nullable: true })
  status: string;

  @Field(() => [PrefixInput2], { nullable: true })
  prefixes: PrefixInput2[];
}

@InputType()
export class PrefixInput2 {
  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true, defaultValue: 'Pending' })
  status: string;

  @Field({ nullable: true })
  ip_range_ini: number;

  @Field({ nullable: true })
  ip_range_end: number;
}
