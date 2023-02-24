import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ApplicationInput } from './dto/application.input';
import { ApplicationArgs } from './dto/application.args';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles()
  @Query(() => Application)
  async application(@Args('id') id: string): Promise<Application> {
    const application = await this.applicationService.findOne(id);
    if (!application) {
      throw new NotFoundException(id);
    }
    return application;
  }

  @Roles()
  @Query(() => [Application])
  applications(
    @Args() applicationArgs: ApplicationArgs,
  ): Promise<Application[]> {
    return this.applicationService.findAll(applicationArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Application)
  async addApplication(
    @Args('newApplicationData') newApplicationData: ApplicationInput,
  ): Promise<Application> {
    const application = await this.applicationService.create(
      newApplicationData,
    );
    pubSub.publish('applicationAdded', { applicationAdded: application });
    return application;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeApplication(@Args('id') id: string) {
    return this.applicationService.remove(id);
  }

  @Subscription(() => Application)
  applicationAdded() {
    return pubSub.asyncIterator('applicationAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => Application)
  async updateApplication(
    @Args('id') id: string,
    @Args('applicationData') applicationData: ApplicationInput,
  ): Promise<Application> {
    const application = await this.applicationService.update(
      id,
      applicationData,
    );
    pubSub.publish('applicationUpdated', { applicationUpdated: application });
    return application;
  }

  @Subscription(() => Application)
  applicationUpdated() {
    return pubSub.asyncIterator('applicationUpdated');
  }
}
