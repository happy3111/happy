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
import { Server } from 'src/server/server.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'server_ips' })
@ObjectType({ description: 'serverIp ' })
export class ServerIp extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field({
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
  @Column
  ip: string;

  @Field({
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
  @Column
  version: string;

  @Field({ middleware: [rolesMiddleware(Role.Admin, Role.User)] })
  @ForeignKey(() => Server)
  @Column
  server_id: number;

  @Field(() => Server)
  @BelongsTo(() => Server)
  server: Server;
}
