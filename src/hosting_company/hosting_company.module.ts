import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HostingCompanyService } from './hosting_company.service';
import { HostingCompany } from './hosting_company.entity';
import { HostingCompanyResolver } from './hosting_company.resolver';

@Module({
  imports: [SequelizeModule.forFeature([HostingCompany])],
  providers: [HostingCompanyResolver, HostingCompanyService],
})
export class HostingCompanyModule {}
