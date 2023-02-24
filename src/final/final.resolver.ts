import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { FinalInput } from './dto/final.input';
import { FinalArgs } from './dto/final.args';
import { Final } from './final.entity';
import { FinalService } from './final.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => Final)
export class FinalResolver {
  constructor(private readonly finalService: FinalService) {}

  @Roles()
  @Query(() => Final)
  async final(@Args('id') id: string): Promise<Final> {
    const final = await this.finalService.findOne(id);
    if (!final) {
      throw new NotFoundException(id);
    }
    return final;
  }

  @Roles()
  @Query(() => [Final])
  finals(@Args() finalArgs: FinalArgs): Promise<Final[]> {
    return this.finalService.findAll(finalArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => Final)
  async addFinal(
    @Args('newFinalData') newFinalData: FinalInput,
  ): Promise<Final> {
    const final = await this.finalService.create(newFinalData);
    pubSub.publish('finalAdded', { finalAdded: final });
    return final;
  }

  @Roles(Role.Admin)
  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeFinal(@Args('id') id: string) {
    return this.finalService.remove(id);
  }

  @Subscription(() => Final)
  finalAdded() {
    return pubSub.asyncIterator('finalAdded');
  }
  @Roles(Role.Admin)
  @Mutation(() => Final)
  async updateFinal(
    @Args('id') id: string,
    @Args('finalData') finalData: FinalInput,
  ): Promise<Final> {
    const final = await this.finalService.update(id, finalData);
    pubSub.publish('finalUpdated', { finalUpdated: final });
    return final;
  }

  @Subscription(() => Final)
  finalUpdated() {
    return pubSub.asyncIterator('finalUpdated');
  }
}
