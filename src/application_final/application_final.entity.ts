import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { Final } from 'src/final/final.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'applications_finals' })
@ObjectType({ description: 'Application_Final ' })
export class ApplicationFinal extends Model {
  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @ForeignKey(() => Application)
  @Column
  applications_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @ForeignKey(() => Final)
  @Column
  final_id: number; // int(11) DEFAULT NULL,

  @Field(() => Application, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => Application)
  application: Application;

  @Field(() => Final, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => Final)
  final: Final;
}
