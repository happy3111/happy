import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { FinalBridgeInput } from './dto/final_bridge.input';
import { FinalBridgeArgs } from './dto/final_bridge.args';
import { FinalBridge } from './final_bridge.entity';
import { FinalBridgeService } from './final_bridge.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => FinalBridge)
export class FinalBridgeResolver {
  constructor(private readonly final_bridgeService: FinalBridgeService) {}

  @Roles()
  @Query(() => FinalBridge)
  async final_bridge(
    @Args('final_id') final_id: string,
    @Args('bridges_id') bridges_id: string,
  ): Promise<FinalBridge> {
    const final_bridge = await this.final_bridgeService.findOne({
      final_id,
      bridges_id,
    });
    if (!final_bridge) {
      throw new NotFoundException(final_id, bridges_id);
    }
    return final_bridge;
  }

  @Roles()
  @Query(() => [FinalBridge])
  final_bridges(
    @Args() final_bridgeArgs: FinalBridgeArgs,
  ): Promise<FinalBridge[]> {
    return this.final_bridgeService.findAll(final_bridgeArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => FinalBridge)
  async addFinalBridge(
    @Args('newFinalBridgeData') newFinalBridgeData: FinalBridgeInput,
  ): Promise<FinalBridge> {
    const final_bridge = await this.final_bridgeService.create(
      newFinalBridgeData,
    );
    pubSub.publish('final_bridgeAdded', { final_bridgeAdded: final_bridge });
    return final_bridge;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeFinalBridge(
    @Args('final_id') final_id: string,
    @Args('bridges_id') bridges_id: string,
  ) {
    return this.final_bridgeService.remove({ final_id, bridges_id });
  }

  @Subscription(() => FinalBridge)
  final_bridgeAdded() {
    return pubSub.asyncIterator('final_bridgeAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => FinalBridge)
  async updateFinalBridge(
    @Args('final_id') final_id: string,
    @Args('bridges_id') bridges_id: string,
    @Args('final_bridgeData') final_bridgeData: FinalBridgeInput,
  ): Promise<FinalBridge> {
    const final_bridge = await this.final_bridgeService.update(
      final_id,
      bridges_id,
      final_bridgeData,
    );
    pubSub.publish('final_bridgeUpdated', {
      final_bridgeUpdated: final_bridge,
    });
    return final_bridge;
  }

  @Subscription(() => FinalBridge)
  final_bridgeUpdated() {
    return pubSub.asyncIterator('final_bridgeUpdated');
  }

  @Roles(Role.Admin)
  @Mutation(() => [FinalBridge])
  async updateFinalBridges(
    @Args({ name: 'data', type: () => [FinalBridgeInput] })
    data: FinalBridgeInput[],
  ): Promise<FinalBridge[]> {
    const final_bridges = await this.final_bridgeService.update_mass(data);
    pubSub.publish('final_bridge_massUpdated', {
      final_bridge_massUpdated: final_bridges,
    });
    return final_bridges;
  }

  @Subscription(() => [FinalBridge])
  final_bridge_massUpdated() {
    return pubSub.asyncIterator('final_bridge_massUpdated');
  }
}
