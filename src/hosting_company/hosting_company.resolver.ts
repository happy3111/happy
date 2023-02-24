import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { HostingCompanyInput } from './dto/hosting_company.input';
import { HostingCompanyArgs } from './dto/hosting_company.args';
import { HostingCompany } from './hosting_company.entity';
import { HostingCompanyService } from './hosting_company.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

const pubSub = new PubSub();

@Resolver(() => HostingCompany)
export class HostingCompanyResolver {
  constructor(private readonly hosting_companyService: HostingCompanyService) {}

  @Roles()
  @Query(() => HostingCompany)
  async hosting_company(@Args('id') id: string): Promise<HostingCompany> {
    const hosting_company = await this.hosting_companyService.findOne(id);
    if (!hosting_company) {
      throw new NotFoundException(id);
    }
    return hosting_company;
  }

  @Roles(Role.Admin)
  @Query(() => [HostingCompany])
  hosting_companies(
    @Args() hosting_companyArgs: HostingCompanyArgs,
  ): Promise<HostingCompany[]> {
    return this.hosting_companyService.findAll(hosting_companyArgs);
  }

  @Roles(Role.Admin)
  @Mutation(() => HostingCompany)
  async addHostingCompany(
    @Args('newHostingCompanyData') newHostingCompanyData: HostingCompanyInput,
  ): Promise<HostingCompany> {
    const hosting_company = await this.hosting_companyService.create(
      newHostingCompanyData,
    );
    pubSub.publish('hosting_companyAdded', {
      hosting_companyAdded: hosting_company,
    });
    return hosting_company;
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async removeHostingCompany(@Args('id') id: string) {
    return this.hosting_companyService.remove(id);
  }

  @Subscription(() => HostingCompany)
  hosting_companyAdded() {
    return pubSub.asyncIterator('hosting_companyAdded');
  }

  @Roles(Role.Admin)
  @Mutation(() => HostingCompany)
  async updateHostingCompany(
    @Args('id') id: string,
    @Args('hostingCompanyData') newHostingCompanyData: HostingCompanyInput,
  ): Promise<HostingCompany> {
    const hosting_company = await this.hosting_companyService.update(
      id,
      newHostingCompanyData,
    );
    pubSub.publish('hosting_companyUpdated', {
      hosting_companyUpdated: hosting_company,
    });
    return hosting_company;
  }

  @Subscription(() => HostingCompany)
  hosting_companyUpdated() {
    return pubSub.asyncIterator('hosting_companyUpdated');
  }
}
