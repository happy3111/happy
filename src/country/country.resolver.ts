import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CountryInput } from './dto/country.input';
import { CountryArgs } from './dto/country.args';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Roles()
  @Query(() => Country)
  async country(@Args('id') id: string): Promise<Country> {
    const country = await this.countryService.findOne(id);
    if (!country) {
      throw new NotFoundException(id);
    }
    return country;
  }

  @Roles()
  @Query(() => [Country])
  countries(@Args() countryArgs: CountryArgs): Promise<Country[]> {
    return this.countryService.findAll(countryArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Country)
  async addCountry(
    @Args('newCountryData') newCountryData: CountryInput,
  ): Promise<Country> {
    const country = await this.countryService.create(newCountryData);
    pubSub.publish('countryAdded', { countryAdded: country });
    return country;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeCountry(@Args('id') id: string) {
    return this.countryService.remove(id);
  }

  @Subscription(() => Country)
  countryAdded() {
    return pubSub.asyncIterator('countryAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => Country)
  async updateCountry(
    @Args('id') id: string,
    @Args('countryData') countryData: CountryInput,
  ): Promise<Country> {
    const country = await this.countryService.update(id, countryData);
    pubSub.publish('countryUpdated', { countryUpdated: country });
    return country;
  }

  @Subscription(() => Country)
  countryUpdated() {
    return pubSub.asyncIterator('countryUpdated');
  }
}
