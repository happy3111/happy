import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ASNInput } from './dto/asn.input';
import { ASNArgs } from './dto/asn.args';
import { ASN } from './asn.entity';
import { ASNService } from './asn.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => ASN)
export class ASNResolver {
  constructor(private readonly asnService: ASNService) {}

  @Roles()
  @Query(() => ASN)
  async asn(@Args('id') id: string): Promise<ASN> {
    const asn = await this.asnService.findOne(id);
    if (!asn) {
      throw new NotFoundException(id);
    }
    return asn;
  }

  @Roles()
  @Query(() => [ASN])
  asns(@Args() asnArgs: ASNArgs): Promise<ASN[]> {
    return this.asnService.findAll(asnArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => ASN)
  async addASN(@Args('newASNData') newASNData: ASNInput): Promise<ASN> {
    const asn = await this.asnService.create(newASNData);
    pubSub.publish('asnAdded', { asnAdded: asn });
    return asn;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeASN(@Args('id') id: string) {
    return this.asnService.remove(id);
  }

  @Subscription(() => ASN)
  asnAdded() {
    return pubSub.asyncIterator('asnAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => ASN)
  async updateASN(
    @Args('id') id: string,
    @Args('asnData') asnData: ASNInput,
  ): Promise<ASN> {
    const asn = await this.asnService.update(id, asnData);
    pubSub.publish('asnUpdated', { asnUpdated: asn });
    return asn;
  }

  @Subscription(() => ASN)
  asnUpdated() {
    return pubSub.asyncIterator('asnUpdated');
  }
}
