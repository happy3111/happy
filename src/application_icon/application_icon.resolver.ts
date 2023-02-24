import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ApplicationIconInput } from './dto/application_icon.input';
import { ApplicationIconArgs } from './dto/application_icon.args';
import { ApplicationIcon } from './application_icon.entity';
import { ApplicationIconService } from './application_icon.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => ApplicationIcon)
export class ApplicationIconResolver {
  constructor(
    private readonly application_iconService: ApplicationIconService,
  ) {}

  @Roles()
  @Query(() => ApplicationIcon)
  async application_icon(
    @Args('applications_id') applications_id: string,
    @Args('final_id') final_id: string,
  ): Promise<ApplicationIcon> {
    const application_icon = await this.application_iconService.findOne({
      applications_id,
      final_id,
    });
    if (!application_icon) {
      throw new NotFoundException(applications_id, final_id);
    }
    return application_icon;
  }

  @Roles()
  @Query(() => [ApplicationIcon])
  application_icons(
    @Args() application_iconArgs: ApplicationIconArgs,
  ): Promise<ApplicationIcon[]> {
    return this.application_iconService.findAll(application_iconArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => ApplicationIcon)
  async addApplicationIcon(
    @Args('newApplicationIconData')
    newApplicationIconData: ApplicationIconInput,
  ): Promise<ApplicationIcon> {
    const application_icon = await this.application_iconService.create(
      newApplicationIconData,
    );
    pubSub.publish('application_iconAdded', {
      application_iconAdded: application_icon,
    });
    return application_icon;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeApplicationIcon(
    @Args('applications_id') applications_id: string,
    @Args('final_id') final_id: string,
  ) {
    return this.application_iconService.remove({ applications_id, final_id });
  }

  @Subscription(() => ApplicationIcon)
  application_iconAdded() {
    return pubSub.asyncIterator('application_iconAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => ApplicationIcon)
  async updateApplicationIcon(
    @Args('id') id: string,
    @Args('application_iconData') application_iconData: ApplicationIconInput,
  ): Promise<ApplicationIcon> {
    const application_icon = await this.application_iconService.update(
      id,
      application_iconData,
    );
    pubSub.publish('application_iconUpdated', {
      application_iconUpdated: application_icon,
    });
    return application_icon;
  }

  @Subscription(() => ApplicationIcon)
  application_iconUpdated() {
    return pubSub.asyncIterator('application_iconUpdated');
  }
}
