import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataCenterService } from './datacenter.service';
import { DataCenter } from './datacenter.entity';
import { DataCenterResolver } from './datacenter.resolver';

@Module({
  imports: [SequelizeModule.forFeature([DataCenter])],
  providers: [DataCenterResolver, DataCenterService],
})
export class DataCenterModule {}
