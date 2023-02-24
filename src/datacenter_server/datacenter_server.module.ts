import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataCenterServerService } from './datacenter_server.service';
import { DataCenterServer } from './datacenter_server.entity';
import { DataCenterServerResolver } from './datacenter_server.resolver';

@Module({
  imports: [SequelizeModule.forFeature([DataCenterServer])],
  providers: [DataCenterServerResolver, DataCenterServerService],
})
export class DataCenterServerModule {}
