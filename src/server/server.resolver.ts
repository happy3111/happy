import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ServerIpArgs } from 'src/serverIp/dto/serverIp.args';
import { ServerIp } from 'src/serverIp/serverIp.entity';
import { filter_array } from 'utils';
import { ServerInput } from './dto/server.input';
import { ServersArgs } from './dto/servers.args';
import { Server } from './server.entity';
import { ServerService } from './server.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Server)
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}

  @Roles()
  @Query(() => Server)
  async server(@Args('id') id: string): Promise<Server> {
    const server = await this.serverService.findOne(id);
    if (!server) {
      throw new NotFoundException(id);
    }
    return server;
  }

  @Roles()
  @Query(() => [Server])
  servers(@Args() serverArgs: ServersArgs): Promise<Server[]> {
    return this.serverService.findAll(serverArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Server)
  async addServer(
    @Args('newServerData') newServerData: ServerInput,
  ): Promise<Server> {
    const server = await this.serverService.create(newServerData);
    pubSub.publish('serverAdded', { serverAdded: server });
    return server;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeServer(@Args('id') id: string) {
    return this.serverService.remove(id);
  }

  @Subscription(() => Server)
  serverAdded() {
    return pubSub.asyncIterator('serverAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => Server)
  async updateServer(
    @Args('id') id: string,
    @Args('serverData') serverData: ServerInput,
  ): Promise<Server> {
    const server = await this.serverService.update(id, serverData);
    pubSub.publish('serverUpdated', { serverUpdated: server });
    return server;
  }

  @Subscription(() => Server)
  serverUpdated() {
    return pubSub.asyncIterator('serverUpdated');
  }

  @ResolveField(() => [ServerIp])
  async ips(
    @Parent() server: Server,
    @Args() args: ServerIpArgs,
  ): Promise<ServerIp[]> {
    console.log('ip args', filter_array(server.ips, args));
    // return filter_array(server.ips, args);
    return filter_array(server.ips, args);
    // return server.ips;
  }
}
