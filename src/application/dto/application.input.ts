import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApplicationInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  category: string;

  @Field({ nullable: true })
  tag: string;

  @Field({ nullable: true })
  os: string;

  @Field({ nullable: true })
  proxy_rules: string;

  @Field({ nullable: true })
  proxy_rules_ext: string;

  @Field({ nullable: true })
  protocol: string;

  @Field({ nullable: true })
  applications_icons_id: number;

  @Field({ nullable: true })
  send_direct_rtt: number;

  @Field({ nullable: true })
  automatic: number;

  @Field({ nullable: true })
  store_icons_id: number;
}
