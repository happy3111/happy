import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CountryInput {
  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  name: string;
}
