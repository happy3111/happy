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
import { Country } from 'src/country/country.entity';
import { Role } from 'src/auth/role.enum';
import { rolesMiddleware } from 'src/auth/roles.middleware';

@Table({ tableName: 'cities' })
@ObjectType({ description: 'city ' })
export class City extends Model {
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
  @ForeignKey(() => Country)
  country_id: number;

  @Field({
    nullable: true,
    middleware: [rolesMiddleware(Role.Admin, Role.Bridges)],
  })
  @BelongsTo(() => Country)
  country: Country;
}

export const CityInclude = {
  model: City,
  include: ['country'],
};
