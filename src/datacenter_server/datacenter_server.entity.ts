import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { Server } from 'src/server/server.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'datacenters_servers' })
@ObjectType({ description: 'DataCenter_Server ' })
export class DataCenterServer extends Model {
  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @ForeignKey(() => DataCenter)
  @Column
  datacenter_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @PrimaryKey
  @ForeignKey(() => Server)
  @Column
  server_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  rtt: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => DataCenter)
  datacenter: DataCenter;

  @Field(() => Server, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => Server)
  server: Server;
}
