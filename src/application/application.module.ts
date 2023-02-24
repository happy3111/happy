import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationService } from './application.service';
import { Application } from './application.entity';
import { ApplicationResolver } from './application.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Application])],
  providers: [ApplicationResolver, ApplicationService],
})
export class ApplicationModule {}
