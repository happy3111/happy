import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ApplicationDatacenterInput } from './dto/application_datacenter.input';
import { ApplicationDatacenterArgs } from './dto/application_datacenter.args';
import { ApplicationDatacenter } from './application_datacenter.entity';
import { ApplicationDatacenterService } from './application_datacenter.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => ApplicationDatacenter)
export class ApplicationDatacenterResolver {
  constructor(
    private readonly application_datacenterService: ApplicationDatacenterService,
  ) {}

  @Roles()
  @Query(() => ApplicationDatacenter)
  async application_datacenter(
    @Args('application_id') application_id: string,
    @Args('server_id') server_id: string,
  ): Promise<ApplicationDatacenter> {
    const application_datacenter =
      await this.application_datacenterService.findOne({
        application_id,
        server_id,
      });
    if (!application_datacenter) {
      throw new NotFoundException(application_id, server_id);
    }
    return application_datacenter;
  }

  @Roles()
  @Query(() => [ApplicationDatacenter])
  application_datacenters(
    @Args() application_datacenterArgs: ApplicationDatacenterArgs,
  ): Promise<ApplicationDatacenter[]> {
    return this.application_datacenterService.findAll(
      application_datacenterArgs,
    );
  }

  @Roles(Role.Admin)
  @Mutation(() => ApplicationDatacenter)
  async addApplicationDatacenter(
    @Args('newApplicationDatacenterData')
    newApplicationDatacenterData: ApplicationDatacenterInput,
  ): Promise<ApplicationDatacenter> {
    const application_datacenter =
      await this.application_datacenterService.create(
        newApplicationDatacenterData,
      );
    pubSub.publish('application_datacenterAdded', {
      application_datacenterAdded: application_datacenter,
    });
    return application_datacenter;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeApplicationDatacenter(
    @Args('application_id') application_id: string,
    @Args('server_id') server_id: string,
  ) {
    return this.application_datacenterService.remove({
      application_id,
      server_id,
    });
  }

  @Subscription(() => ApplicationDatacenter)
  application_datacenterAdded() {
    return pubSub.asyncIterator('application_datacenterAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => ApplicationDatacenter)
  async updateApplicationDatacenter(
    @Args('id') id: string,
    @Args('application_datacenterData')
    application_datacenterData: ApplicationDatacenterInput,
  ): Promise<ApplicationDatacenter> {
    const application_datacenter =
      await this.application_datacenterService.update(
        id,
        application_datacenterData,
      );
    pubSub.publish('application_datacenterUpdated', {
      application_datacenterUpdated: application_datacenter,
    });
    return application_datacenter;
  }

  @Subscription(() => ApplicationDatacenter)
  application_datacenterUpdated() {
    return pubSub.asyncIterator('application_datacenterUpdated');
  }
}
