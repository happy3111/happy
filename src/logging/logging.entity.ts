import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/auth/auth.entity';

@Table({ tableName: 'action_logs', timestamps: true })
@ObjectType({ description: 'actionLog ' })
export class ActionLog extends Model {
  @Field(() => ID, {})
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column
  schema: string;

  @Field()
  @Column
  action: string;

  @Field()
  @Column
  target_id: number;

  @Field()
  @Column
  @ForeignKey(() => User)
  user_id: number;

  @Field(() => User)
  @BelongsTo(() => User)
  user: User;

  @Field(() => [FieldLog])
  @HasMany(() => FieldLog, 'action_log_id')
  changed_fields: FieldLog[];

  @Field()
  createdAt: Date;
}

@Table({ tableName: 'field_logs' })
@ObjectType({ description: 'fieldLog ' })
export class FieldLog extends Model {
  @Field(() => ID, {})
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column
  @ForeignKey(() => ActionLog)
  action_log_id: number;

  @Field()
  @Column
  field: string;

  @Field()
  @Column
  old_value: string;

  @Field()
  @Column
  new_value: string;
}

export const ActionLogInclude = {
  model: ActionLog,
  include: [],
};
