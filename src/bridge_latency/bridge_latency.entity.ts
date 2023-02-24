import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';
import { Bridge } from 'src/bridge/bridge.entity';

@Table({ tableName: 'bridges_latency' })
@ObjectType({ description: 'Bridge_Latency ' })
export class BridgeLatency extends Model {
  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @PrimaryKey
  @Column
  bridge_src_id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @PrimaryKey
  @Column
  bridge_dst_id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @Column
  latency: number;

  @Field(() => Bridge, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)],
  })
  @BelongsTo(() => Bridge, 'bridge_src_id')
  bridge_src: Bridge;

  @Field(() => Bridge, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)],
  })
  @BelongsTo(() => Bridge, 'bridge_dst_id')
  bridge_dst: Bridge;
}
