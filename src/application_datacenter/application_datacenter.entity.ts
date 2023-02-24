import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { Application } from 'src/application/application.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'applications_datacenters' })
@ObjectType({ description: 'Application_Datacenter ' })
export class ApplicationDatacenter extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @ForeignKey(() => Application)
  @Column
  application_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @ForeignKey(() => DataCenter)
  @Column
  datacenter_id: number; // int(11) DEFAULT NULL,

  @Field(() => Application, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => Application)
  application: Application;

  @Field(() => DataCenter, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => DataCenter)
  datacenter: DataCenter;
}
