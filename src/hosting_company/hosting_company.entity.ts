import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'hosting_companies', timestamps: true })
@ObjectType({ description: 'hosting_company ' })
export class HostingCompany extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  company_name: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  portal_url: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column
  api_url: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column
  api_token: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column
  api_doc: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @CreatedAt
  created_at: Date;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @UpdatedAt
  updated_at: Date;
}
