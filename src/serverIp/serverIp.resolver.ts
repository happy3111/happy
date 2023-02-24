import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ServerIpInput } from './dto/serverIp.input';
import { ServerIpArgs } from './dto/serverIp.args';
import { ServerIp } from './serverIp.entity';
import { ServerIpService } from './serverIp.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => ServerIp)
export class ServerIpResolver {
  constructor(private readonly serverIpService: ServerIpService) {}

  @Roles()
  @Query(() => ServerIp)
  async serverIp(@Args('id') id: string): Promise<ServerIp> {
    const serverIp = await this.serverIpService.findOne(id);
    if (!serverIp) {
      throw new NotFoundException(id);
    }
    return serverIp;
  }

  @Roles()
  @Query(() => [ServerIp])
  serverIps(@Args() serverIpArgs: ServerIpArgs): Promise<ServerIp[]> {
    return this.serverIpService.findAll(serverIpArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => ServerIp)
  async addServerIp(
    @Args('newServerIpData') newServerIpData: ServerIpInput,
  ): Promise<ServerIp> {
    const serverIp = await this.serverIpService.create(newServerIpData);
    pubSub.publish('serverIpAdded', { serverIpAdded: serverIp });
    return serverIp;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeServerIp(@Args('id') id: string) {
    return this.serverIpService.remove(id);
  }

  @Subscription(() => ServerIp)
  serverIpAdded() {
    return pubSub.asyncIterator('serverIpAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => ServerIp)
  async updateServerIp(
    @Args('id') id: string,
    @Args('serverIpData') serverIpData: ServerIpInput,
  ): Promise<ServerIp> {
    const serverIp = await this.serverIpService.update(id, serverIpData);
    pubSub.publish('serverIpUpdated', { serverIpUpdated: serverIp });
    return serverIp;
  }

  @Subscription(() => ServerIp)
  serverIpUpdated() {
    return pubSub.asyncIterator('serverIpUpdated');
  }
}
