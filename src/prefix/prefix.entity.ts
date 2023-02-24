import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  DataCenter,
  DataCenterInclude,
} from 'src/datacenter/datacenter.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'prefixes' })
@ObjectType({ description: 'prefix ' })
export class Prefix extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  @ForeignKey(() => DataCenter)
  datacenter_id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  value: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column(DataType.ENUM({ values: ['Active', 'Inactive'] }))
  status: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  ip_range_ini: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  ip_range_end: number;

  @Field(() => DataCenter, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => DataCenter)
  datacenter: DataCenter;
}

export const PrefixInclude = {
  model: Prefix,
  include: [DataCenterInclude],
};
