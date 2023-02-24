import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class HostingCompanyInput {
  @Field({ nullable: true })
  company_name: string;

  @Field({ nullable: true })
  portal_url: string;

  @Field({ nullable: true })
  api_url: string;

  @Field({ nullable: true })
  api_token: string;

  @Field({ nullable: true })
  api_doc: string;
}
