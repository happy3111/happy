import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PrefixInput } from './dto/prefix.input';
import { PrefixArgs } from './dto/prefix.args';
import { Prefix } from './prefix.entity';
import { PrefixService } from './prefix.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Prefix)
export class PrefixResolver {
  constructor(private readonly prefixService: PrefixService) {}

  @Roles()
  @Query(() => Prefix)
  async prefix(@Args('id') id: string): Promise<Prefix> {
    const prefix = await this.prefixService.findOne(id);
    if (!prefix) {
      throw new NotFoundException(id);
    }
    return prefix;
  }

  @Roles()
  @Query(() => [Prefix])
  prefixes(@Args() prefixArgs: PrefixArgs): Promise<Prefix[]> {
    return this.prefixService.findAll(prefixArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Prefix)
  async addPrefix(
    @Args('newPrefixData') newPrefixData: PrefixInput,
  ): Promise<Prefix> {
    const prefix = await this.prefixService.create(newPrefixData);
    pubSub.publish('prefixAdded', { prefixAdded: prefix });
    return prefix;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removePrefix(@Args('id') id: string) {
    return this.prefixService.remove(id);
  }

  @Subscription(() => Prefix)
  prefixAdded() {
    return pubSub.asyncIterator('prefixAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => Prefix)
  async updatePrefix(
    @Args('id') id: string,
    @Args('prefixData') prefixData: PrefixInput,
  ): Promise<Prefix> {
    const prefix = await this.prefixService.update(id, prefixData);
    pubSub.publish('prefixUpdated', { prefixUpdated: prefix });
    return prefix;
  }

  @Subscription(() => Prefix)
  prefixUpdated() {
    return pubSub.asyncIterator('prefixUpdated');
  }
}
