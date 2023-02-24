import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CityInput } from './dto/city.input';
import { CityArgs } from './dto/city.args';
import { City } from './city.entity';
import { CityService } from './city.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => City)
export class CityResolver {
  constructor(private readonly cityService: CityService) {}

  @Roles()
  @Query(() => City)
  async city(@Args('id') id: string): Promise<City> {
    const city = await this.cityService.findOne(id);
    if (!city) {
      throw new NotFoundException(id);
    }
    return city;
  }

  @Roles()
  @Query(() => [City])
  cities(@Args() cityArgs: CityArgs): Promise<City[]> {
    return this.cityService.findAll(cityArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => City)
  async addCity(@Args('newCityData') newCityData: CityInput): Promise<City> {
    const city = await this.cityService.create(newCityData);
    pubSub.publish('cityAdded', { cityAdded: city });
    return city;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeCity(@Args('id') id: string) {
    return this.cityService.remove(id);
  }

  @Subscription(() => City)
  cityAdded() {
    return pubSub.asyncIterator('cityAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => City)
  async updateCity(
    @Args('id') id: string,
    @Args('cityData') cityData: CityInput,
  ): Promise<City> {
    const city = await this.cityService.update(id, cityData);
    pubSub.publish('cityUpdated', { cityUpdated: city });
    return city;
  }

  @Subscription(() => City)
  cityUpdated() {
    return pubSub.asyncIterator('cityUpdated');
  }
}
