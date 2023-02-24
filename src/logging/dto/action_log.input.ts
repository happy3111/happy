import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActionLogInput {
  @Field({ nullable: true })
  schema: string;

  @Field({ nullable: true })
  action: string;

  @Field({ nullable: true })
  target_id: number;

  @Field({ nullable: true })
  user_id: number;

  @Field(() => [FieldLog], { nullable: true })
  changed_fields: FieldLog[];
}

@InputType()
export class FieldLog {
  @Field({ nullable: true })
  field: string;

  @Field({ nullable: true })
  old_value: string;

  @Field({ nullable: true })
  new_value: string;
}
