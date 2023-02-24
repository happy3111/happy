import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DataCenterInput } from './dto/datacenter.input';
import { DataCenterArgs } from './dto/datacenter.args';
import { DataCenter } from './datacenter.entity';
import { DataCenterService } from './datacenter.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => DataCenter)
export class DataCenterResolver {
  constructor(private readonly datacenterService: DataCenterService) {}

  @Roles()
  @Query(() => DataCenter)
  async datacenter(@Args('id') id: string): Promise<DataCenter> {
    const datacenter = await this.datacenterService.findOne(id);
    if (!datacenter) {
      throw new NotFoundException(id);
    }
    return datacenter;
  }

  @Roles()
  @Query(() => [DataCenter])
  datacenters(@Args() datacenterArgs: DataCenterArgs): Promise<DataCenter[]> {
    return this.datacenterService.findAll(datacenterArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => DataCenter)
  async addDataCenter(
    @Args('newDataCenterData') newDataCenterData: DataCenterInput,
  ): Promise<DataCenter> {
    const datacenter = await this.datacenterService.create(newDataCenterData);
    pubSub.publish('datacenterAdded', { datacenterAdded: datacenter });
    return datacenter;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeDataCenter(@Args('id') id: string) {
    return this.datacenterService.remove(id);
  }

  @Subscription(() => DataCenter)
  datacenterAdded() {
    return pubSub.asyncIterator('datacenterAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => DataCenter)
  async updateDataCenter(
    @Args('id') id: string,
    @Args('datacenterData') datacenterData: DataCenterInput,
  ): Promise<DataCenter> {
    const datacenter = await this.datacenterService.update(id, datacenterData);
    pubSub.publish('datacenterUpdated', { datacenterUpdated: datacenter });
    return datacenter;
  }

  @Subscription(() => DataCenter)
  datacenterUpdated() {
    return pubSub.asyncIterator('datacenterUpdated');
  }
}
