import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApplicationIconInput {
  @Field({ nullable: true })
  filename: string;

  @Field({ nullable: true })
  md5: string;
}
