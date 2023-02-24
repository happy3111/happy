import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ApplicationFinalInput } from './dto/application_final.input';
import { ApplicationFinalArgs } from './dto/application_final.args';
import { ApplicationFinal } from './application_final.entity';
import { ApplicationFinalService } from './application_final.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => ApplicationFinal)
export class ApplicationFinalResolver {
  constructor(
    private readonly application_finalService: ApplicationFinalService,
  ) {}

  @Roles()
  @Query(() => ApplicationFinal)
  async application_final(
    @Args('applications_id') applications_id: string,
    @Args('final_id') final_id: string,
  ): Promise<ApplicationFinal> {
    const application_final = await this.application_finalService.findOne({
      applications_id,
      final_id,
    });
    if (!application_final) {
      throw new NotFoundException(applications_id, final_id);
    }
    return application_final;
  }

  @Roles()
  @Query(() => [ApplicationFinal])
  application_finals(
    @Args() application_finalArgs: ApplicationFinalArgs,
  ): Promise<ApplicationFinal[]> {
    return this.application_finalService.findAll(application_finalArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => ApplicationFinal)
  async addApplicationFinal(
    @Args('newApplicationFinalData')
    newApplicationFinalData: ApplicationFinalInput,
  ): Promise<ApplicationFinal> {
    const application_final = await this.application_finalService.create(
      newApplicationFinalData,
    );
    pubSub.publish('application_finalAdded', {
      application_finalAdded: application_final,
    });
    return application_final;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeApplicationFinal(
    @Args('applications_id') applications_id: string,
    @Args('final_id') final_id: string,
  ) {
    return this.application_finalService.remove({ applications_id, final_id });
  }

  @Subscription(() => ApplicationFinal)
  application_finalAdded() {
    return pubSub.asyncIterator('application_finalAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => ApplicationFinal)
  async updateApplicationFinal(
    @Args('id') id: string,
    @Args('application_finalData') application_finalData: ApplicationFinalInput,
  ): Promise<ApplicationFinal> {
    const application_final = await this.application_finalService.update(
      id,
      application_finalData,
    );
    pubSub.publish('application_finalUpdated', {
      application_finalUpdated: application_final,
    });
    return application_final;
  }

  @Subscription(() => ApplicationFinal)
  application_finalUpdated() {
    return pubSub.asyncIterator('application_finalUpdated');
  }
}
