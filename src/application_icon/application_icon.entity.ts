import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'applications_icons' })
@ObjectType({ description: 'Application_Icon ' })
export class ApplicationIcon extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @Column
  filename: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @Column
  md5: string;
}
