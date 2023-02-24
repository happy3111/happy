import {
  Table,
  Column,
  Model,
  Unique,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { DataTypes } from 'sequelize';
import { City, CityInclude } from 'src/city/city.entity';
import { ASN } from 'src/asn/asn.entity';
import { Prefix } from 'src/prefix/prefix.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'datacenters' })
@ObjectType({ description: 'datacenter ' })
export class DataCenter extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Unique
  @ForeignKey(() => ASN)
  @Column
  asn_id: number; // int(11) DEFAULT NULL,

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Unique
  @ForeignKey(() => City)
  @Column
  city_id: number; // int(11) DEFAULT NULL,

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column
  ipfix: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column
  port: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @Column(DataTypes.ENUM('TCP', 'UDP', 'ICMP'))
  protocol: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column(DataTypes.ENUM('Pending', 'Complete'))
  status: string;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => City)
  city: City;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => ASN)
  asn: ASN;

  @Field(() => [Prefix], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @HasMany(() => Prefix, 'datacenter_id')
  prefixes: Prefix[];
}

export const DataCenterInclude = {
  model: DataCenter,
  include: [CityInclude, 'asn'],
};
