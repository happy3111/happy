import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationDatacenterService } from './application_datacenter.service';
import { ApplicationDatacenter } from './application_datacenter.entity';
import { ApplicationDatacenterResolver } from './application_datacenter.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ApplicationDatacenter])],
  providers: [ApplicationDatacenterResolver, ApplicationDatacenterService],
})
export class ApplicationDatacenterModule {}
