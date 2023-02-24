import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { BridgeLatencyInput } from './dto/bridge_latency.input';
import { BridgeLatencyArgs } from './dto/bridge_latency.args';
import { BridgeLatency } from './bridge_latency.entity';
import { BridgeLatencyService } from './bridge_latency.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => BridgeLatency)
export class BridgeLatencyResolver {
  constructor(private readonly bridge_latencyService: BridgeLatencyService) {}

  @Roles()
  @Query(() => BridgeLatency)
  async bridge_latency(
    @Args('bridge_src_id') bridge_src_id: string,
    @Args('bridge_dst_id') bridge_dst_id: string,
  ): Promise<BridgeLatency> {
    const bridge_latency = await this.bridge_latencyService.findOne({
      bridge_src_id,
      bridge_dst_id,
    });
    if (!bridge_latency) {
      throw new NotFoundException(bridge_src_id, bridge_dst_id);
    }
    return bridge_latency;
  }

  @Roles()
  @Query(() => [BridgeLatency])
  bridge_latencies(
    @Args() bridge_latencyArgs: BridgeLatencyArgs,
  ): Promise<BridgeLatency[]> {
    return this.bridge_latencyService.findAll(bridge_latencyArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => BridgeLatency)
  async addBridgeLatency(
    @Args('newBridgeLatencyData') newBridgeLatencyData: BridgeLatencyInput,
  ): Promise<BridgeLatency> {
    const bridge_latency = await this.bridge_latencyService.create(
      newBridgeLatencyData,
    );
    pubSub.publish('bridge_latencyAdded', {
      bridge_latencyAdded: bridge_latency,
    });
    return bridge_latency;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeBridgeLatency(
    @Args('applications_id') applications_id: string,
    @Args('final_id') final_id: string,
  ) {
    return this.bridge_latencyService.remove({ applications_id, final_id });
  }

  @Subscription(() => BridgeLatency)
  bridge_latencyAdded() {
    return pubSub.asyncIterator('bridge_latencyAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => BridgeLatency)
  async updateBridgeLatency(
    @Args('id') id: string,
    @Args('bridge_latencyData') bridge_latencyData: BridgeLatencyInput,
  ): Promise<BridgeLatency> {
    const bridge_latency = await this.bridge_latencyService.update(
      id,
      bridge_latencyData,
    );
    pubSub.publish('bridge_latencyUpdated', {
      bridge_latencyUpdated: bridge_latency,
    });
    return bridge_latency;
  }

  @Subscription(() => BridgeLatency)
  bridge_latencyUpdated() {
    return pubSub.asyncIterator('bridge_latencyUpdated');
  }

  @Roles(Role.Admin)
  @Mutation(() => [BridgeLatency])
  async updateBridgeLatencies(
    @Args({ name: 'data', type: () => [BridgeLatencyInput] })
    data: BridgeLatencyInput[],
  ): Promise<BridgeLatency[]> {
    const bridge_latencies = await this.bridge_latencyService.update_mass(data);
    pubSub.publish('bridge_latency_massUpdated', {
      bridge_latency_massUpdated: bridge_latencies,
    });
    return bridge_latencies;
  }

  @Subscription(() => [BridgeLatency])
  bridge_latency_massUpdated() {
    return pubSub.asyncIterator('bridge_latency_massUpdated');
  }
}
