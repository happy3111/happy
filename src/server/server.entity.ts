import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  HasMany,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Bridge } from 'src/bridge/bridge.entity';
import { ServerIp } from 'src/serverIp/serverIp.entity';
import { DataCenterServer } from 'src/datacenter_server/datacenter_server.entity';
import { HostingCompany } from 'src/hosting_company/hosting_company.entity';
import { City } from 'src/city/city.entity';
import { rolesMiddleware } from 'src/auth/roles.middleware';
import { Role } from 'src/auth/role.enum';

@Table({ tableName: 'servers' })
@ObjectType({ description: 'server ' })
export class Server extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  hostname: string;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  is_nat: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.User)],
  })
  @Column
  datacenter_id: number;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  zabbix_hostid: string;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  @ForeignKey(() => HostingCompany)
  hosting_company_id: number;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column(
    DataType.ENUM({ values: ['bare-metal', 'kvm', 'open-vz', 'azure', 'aws'] }),
  )
  type: string;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column(DataType.ENUM({ values: ['fixed', 'on-demand'] }))
  billing_type: string;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  price: number;

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  bandwidth_limit: number;

  @Field(() => Bridge, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin)],
  })
  @HasOne(() => Bridge, 'server_id')
  bridge: Bridge;

  @Field(() => [ServerIp], {
    nullable: true,
    middleware: [
      rolesMiddleware(
        Role.Admin,
        Role.User,
        Role.Bridges,
        Role.Finals,
        Role.Latency,
      ),
    ],
  })
  @HasMany(() => ServerIp, 'server_id')
  ips: ServerIp[];

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.User)],
  })
  @BelongsTo(() => DataCenter, 'datacenter_id')
  datacenter: DataCenter;

  @Field(() => [DataCenterServer], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.User)],
  })
  @HasMany(() => DataCenterServer, 'server_id')
  datacenter_servers: DataCenterServer[];

  @Field({ nullable: true, middleware: [rolesMiddleware(Role.Admin)] })
  @BelongsTo(() => HostingCompany)
  hosting_company: HostingCompany;
}

export const ServerInclude = {
  model: Server,
  include: [
    'bridge',
    'ips',
    'hosting_company',
    {
      model: DataCenterServer,
      include: [
        {
          model: DataCenter,
          include: [
            {
              model: City,
              include: ['country'],
            },
            'asn',
          ],
        },
      ],
    },
    {
      model: DataCenter,
      include: [
        {
          model: City,
          include: ['country'],
        },
        'asn',
      ],
    },
  ],
};
