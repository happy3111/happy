import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ServerInput {
  @Field({ nullable: true })
  hostname: string;

  @Field({ nullable: true })
  is_nat: number;

  @Field({ nullable: true })
  datacenter_id: number;

  @Field({ nullable: true })
  zabbix_hostid: string;

  @Field({ nullable: true })
  hosting_company_id: number;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  billing_type: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  bandwidth_limit: number;

  @Field(() => [ServerIpInput2], { nullable: true })
  ips: ServerIpInput2[];
}

@InputType()
export class ServerIpInput2 {
  @Field({ nullable: true })
  ip: string;

  @Field({ nullable: true })
  version: string;
}
