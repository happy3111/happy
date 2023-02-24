import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationIconService } from './application_icon.service';
import { ApplicationIcon } from './application_icon.entity';
import { ApplicationIconResolver } from './application_icon.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ApplicationIcon])],
  providers: [ApplicationIconResolver, ApplicationIconService],
})
export class ApplicationIconModule {}
