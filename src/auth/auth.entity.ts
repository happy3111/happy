import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Table({ tableName: 'users' })
@ObjectType({ description: 'auth ' })
export class User extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column
  username: string;

  // @Field()
  @Column
  password: string;

  @Field()
  @Column
  role: string;

  @Field()
  @Column
  apikey: string;
}
