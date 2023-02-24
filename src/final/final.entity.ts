import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { ApplicationFinal } from 'src/application_final/application_final.entity';
import { Server, ServerInclude } from 'src/server/server.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { FinalBridge } from 'src/final_bridge/final_bridge.entity';
import { rolesMiddleware } from 'src/auth/roles.middleware';
import { Role } from 'src/auth/role.enum';

@Table({ tableName: 'finals' })
@ObjectType({ description: 'final ' })
export class Final extends Model {
  @Field(() => ID, {})
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Finals)] })
  @Column
  order: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Finals)] })
  @Column
  name: string;

  @Field({
    middleware: [
      rolesMiddleware(Role.Admin, Role.User, Role.Finals, Role.Bridges),
    ],
  })
  @Column
  alias: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Finals)],
  })
  @Column
  group_alias: string;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Finals, Role.Bridges)],
  })
  @Column
  tcp_port: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Finals, Role.Bridges)],
  })
  @Column
  udp_port: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  wi_port: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  wi_password: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  max_connections: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  max_files: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  downstream_limit: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  user_cache_reloading_interval: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  is_nat: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Finals)] })
  @Column
  proxify_ipv6: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Finals)] })
  @Column
  hidden: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  is_proxy: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  threads: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  password: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Finals)],
  })
  @Column
  zabbix_hostid: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  @ForeignKey(() => DataCenter)
  datacenter_id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.Finals)] })
  @Column
  logging: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Finals)] })
  @Column
  @ForeignKey(() => Server)
  server_id: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Finals)],
  })
  @BelongsTo(() => DataCenter)
  datacenter: DataCenter;

  @Field({
    nullable: true,
    middleware: [
      rolesMiddleware(
        Role.Admin,
        Role.Bridges,
        Role.Finals,
        Role.Bridges,
        Role.Latency,
      ),
    ],
  })
  @BelongsTo(() => Server)
  server: Server;

  @Field(() => [Application], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Finals)],
  })
  @BelongsToMany(() => Application, () => ApplicationFinal)
  applications: [Application];

  @Field(() => [FinalBridge], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Finals)],
  })
  @HasMany(() => FinalBridge, 'final_id')
  final_bridges: FinalBridge[];
}

export const FinalInclude = {
  model: Final,
  include: [ServerInclude, 'applications'],
};
