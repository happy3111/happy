import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Server, ServerInclude } from 'src/server/server.entity';
import { FinalBridge } from 'src/final_bridge/final_bridge.entity';
import { rolesMiddleware } from 'src/auth/roles.middleware';
import { Role } from 'src/auth/role.enum';

@ObjectType({ description: 'bridge ' })
@Table({ tableName: 'bridges' })
export class Bridge extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Bridges)] })
  @Column
  name: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  group: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  group_alias: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  ip: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  ipv6: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Bridges)] })
  @Column
  tcp_port: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Bridges)] })
  @Column
  udp_port: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  wi_port: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  wi_password: string;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  logging: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  max_files: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  user_cache_reloading_interval: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  threads: number;

  @Field({
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  ddos_protection: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @Column
  zabbix_hostid: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Bridges)] })
  @ForeignKey(() => Server)
  @Column
  server_id: number;

  @Field(() => Server, {
    nullable: true,
    middleware: [
      rolesMiddleware(
        Role.Admin,
        Role.Bridges,
        Role.Bridges,
        Role.Latency,
        Role.User,
      ),
    ],
  })
  @BelongsTo(() => Server)
  server: Server;

  @Field(() => [FinalBridge], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges, Role.Bridges)],
  })
  @HasMany(() => FinalBridge, 'bridges_id')
  final_bridges: FinalBridge[];
}

export const BridgeInclude = {
  model: Bridge,
  include: [ServerInclude],
};
