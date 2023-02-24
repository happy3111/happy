import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DataCenterServerInput } from './dto/datacenter_server.input';
import { DataCenterServerArgs } from './dto/datacenter_server.args';
import { DataCenterServer } from './datacenter_server.entity';
import { DataCenterServerService } from './datacenter_server.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => DataCenterServer)
export class DataCenterServerResolver {
  constructor(
    private readonly datacenter_serverService: DataCenterServerService,
  ) {}

  @Roles()
  @Query(() => DataCenterServer)
  async datacenter_server(
    @Args('datacenter_id') datacenter_id: string,
    @Args('server_id') server_id: string,
  ): Promise<DataCenterServer> {
    const datacenter_server = await this.datacenter_serverService.findOne({
      datacenter_id,
      server_id,
    });
    if (!datacenter_server) {
      throw new NotFoundException(datacenter_id, server_id);
    }
    return datacenter_server;
  }

  @Roles()
  @Query(() => [DataCenterServer])
  datacenter_servers(
    @Args() datacenter_serverArgs: DataCenterServerArgs,
  ): Promise<DataCenterServer[]> {
    return this.datacenter_serverService.findAll(datacenter_serverArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => DataCenterServer)
  async addDataCenterServer(
    @Args('newDataCenterServerData')
    newDataCenterServerData: DataCenterServerInput,
  ): Promise<DataCenterServer> {
    const datacenter_server = await this.datacenter_serverService.create(
      newDataCenterServerData,
    );
    pubSub.publish('datacenter_serverAdded', {
      datacenter_serverAdded: datacenter_server,
    });
    return datacenter_server;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeDataCenterServer(
    @Args('datacenter_id') datacenter_id: string,
    @Args('server_id') server_id: string,
  ) {
    return this.datacenter_serverService.remove({ datacenter_id, server_id });
  }

  @Subscription(() => DataCenterServer)
  datacenter_serverAdded() {
    return pubSub.asyncIterator('datacenter_serverAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => DataCenterServer)
  async updateDataCenterServer(
    @Args('id') id: string,
    @Args('datacenter_serverData') datacenter_serverData: DataCenterServerInput,
  ): Promise<DataCenterServer> {
    const datacenter_server = await this.datacenter_serverService.update(
      id,
      datacenter_serverData,
    );
    pubSub.publish('datacenter_serverUpdated', {
      datacenter_serverUpdated: datacenter_server,
    });
    return datacenter_server;
  }

  @Subscription(() => DataCenterServer)
  datacenter_serverUpdated() {
    return pubSub.asyncIterator('datacenter_serverUpdated');
  }
}
