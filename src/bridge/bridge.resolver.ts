import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { BridgeInput } from './dto/bridge.input';
import { BridgeArgs } from './dto/bridges.args';
import { Bridge } from './bridge.entity';
import { BridgeService } from './bridge.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Bridge)
export class BridgeResolver {
  constructor(private readonly bridgeService: BridgeService) {}

  @Roles()
  @Query(() => Bridge)
  async bridge(@Args('id') id: string): Promise<Bridge> {
    const bridge = await this.bridgeService.findOne(id);
    if (!bridge) {
      throw new NotFoundException(id);
    }
    return bridge;
  }

  @Roles(Role.Admin, Role.Bridges, Role.Latency, Role.User)
  @Query(() => [Bridge])
  bridges(@Args() bridgeArgs: BridgeArgs): Promise<Bridge[]> {
    return this.bridgeService.findAll(bridgeArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Bridge)
  async addBridge(
    @Args('newBridgeData') newBridgeData: BridgeInput,
  ): Promise<Bridge> {
    const bridge = await this.bridgeService.create(newBridgeData);
    pubSub.publish('bridgeAdded', { bridgeAdded: bridge });
    return bridge;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeBridge(@Args('id') id: string) {
    return this.bridgeService.remove(id);
  }

  @Subscription(() => Bridge)
  bridgeAdded() {
    return pubSub.asyncIterator('bridgeAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => Bridge)
  async updateBridge(
    @Args('id') id: string,
    @Args('bridgeData') bridgeData: BridgeInput,
  ): Promise<Bridge> {
    const bridge = await this.bridgeService.update(id, bridgeData);
    pubSub.publish('bridgeUpdated', { bridgeUpdated: bridge });
    return bridge;
  }

  @Subscription(() => Bridge)
  bridgeUpdated() {
    return pubSub.asyncIterator('bridgeUpdated');
  }
}
