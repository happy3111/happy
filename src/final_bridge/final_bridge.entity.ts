import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { Final, FinalInclude } from 'src/final/final.entity';
import { Bridge } from 'src/bridge/bridge.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'finals_bridges_latency' })
@ObjectType({ description: 'Final_Bridge_Latency ' })
export class FinalBridge extends Model {
  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @PrimaryKey
  @ForeignKey(() => Final)
  @Column
  final_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @PrimaryKey
  @ForeignKey(() => Bridge)
  @Column
  bridges_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User, Role.Latency)] })
  @Column
  latency: number;

  @Field({
    defaultValue: 1,
    middleware: [rolesMiddleware(Role.Admin, Role.Latency)],
  })
  @Column({ defaultValue: 1, allowNull: false })
  online: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Latency)],
  })
  @BelongsTo(() => Final)
  final: Final;

  @Field(() => Bridge, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Latency)],
  })
  @BelongsTo(() => Bridge)
  bridge: Bridge;
}

export const FinalBridgeInput = {
  model: FinalBridge,
  include: [FinalInclude, 'bridge'],
};
