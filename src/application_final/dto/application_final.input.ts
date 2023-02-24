import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApplicationFinalInput {
  @Field({ nullable: true })
  applications_id: number; // int(11) DEFAULT NULL,

  @Field({ nullable: true })
  final_id: number; // int(11) DEFAULT NULL,
}
