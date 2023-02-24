import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FinalInput {
  @Field({ nullable: true })
  order: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  alias: string;

  @Field({ nullable: true })
  group_alias: string;

  @Field({ nullable: true })
  tcp_port: number;

  @Field({ nullable: true })
  udp_port: number;

  @Field({ nullable: true })
  wi_port: number;

  @Field({ nullable: true })
  wi_password: string;

  @Field({ nullable: true })
  max_connections: number;

  @Field({ nullable: true })
  max_files: number;

  @Field({ nullable: true })
  downstream_limit: number;

  @Field({ nullable: true })
  user_cache_reloading_interval: number;

  @Field({ nullable: true })
  is_nat: number;

  @Field({ nullable: true })
  proxify_ipv6: number;

  @Field({ nullable: true })
  hidden: number;

  @Field({ nullable: true })
  is_proxy: number;

  @Field({ nullable: true })
  threads: number;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  zabbix_hostid: number;

  @Field({ nullable: true })
  datacenter_id: number;

  @Field({ nullable: true })
  logging: number;

  @Field({ nullable: true })
  server_id: number;
}
