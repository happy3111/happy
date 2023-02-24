import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ServerIpInput {
  @Field({ nullable: true })
  ip: string;

  @Field({ nullable: true })
  version: string;

  @Field({ nullable: true })
  server_id: number;
}
