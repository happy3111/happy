import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApplicationDatacenter } from 'src/application_datacenter/application_datacenter.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { Final } from 'src/final/final.entity';
import { ApplicationFinal } from 'src/application_final/application_final.entity';
import { ApplicationIcon } from 'src/application_icon/application_icon.entity';
import { rolesMiddleware } from 'src/auth/roles.middleware';
import { Role } from 'src/auth/role.enum';

@Table({ tableName: 'applications' })
@ObjectType({ description: 'application ' })
export class Application extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  name: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  category: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  tag: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  os: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  proxy_rules: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin)], nullable: true })
  @Column
  proxy_rules_ext: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  protocol: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin)] })
  @Column
  @ForeignKey(() => ApplicationIcon)
  applications_icons_id: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  send_direct_rtt: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @Column
  automatic: number;

  @Field({ middleware: [rolesMiddleware(Role.Admin)], nullable: true })
  @Column
  store_icons_id: number;

  @Field(() => [DataCenter], {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsToMany(() => DataCenter, () => ApplicationDatacenter)
  datacenters: [DataCenter];

  @Field(() => [Final], {
    middleware: [rolesMiddleware(Role.Admin)],
    nullable: true,
  })
  @BelongsToMany(() => Final, () => ApplicationFinal)
  finals: [Final];

  @Field(() => ApplicationIcon, {
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => ApplicationIcon)
  icon: ApplicationIcon;
}
