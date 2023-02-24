import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BridgeInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  group: number;

  @Field({ nullable: true })
  group_alias: string;

  @Field({ nullable: true })
  ip: string;

  @Field({ nullable: true })
  ipv6: string;

  @Field({ nullable: true })
  tcp_port: number;

  @Field({ nullable: true })
  udp_port: number;

  @Field({ nullable: true })
  wi_port: number;

  @Field({ nullable: true })
  wi_password: string;

  @Field({ nullable: true })
  logging: number;

  @Field({ nullable: true })
  max_files: number;

  @Field({ nullable: true })
  user_cache_reloading_interval: number;

  @Field({ nullable: true })
  threads: number;

  @Field({ nullable: true })
  ddos_protection: number;

  @Field({ nullable: true })
  zabbix_hostid: string;

  @Field({ nullable: true })
  server_id: number;
}
