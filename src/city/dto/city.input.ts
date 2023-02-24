import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CityInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  country_id: number;
}
