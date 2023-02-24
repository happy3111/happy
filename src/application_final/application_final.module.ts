import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApplicationFinalService } from './application_final.service';
import { ApplicationFinal } from './application_final.entity';
import { ApplicationFinalResolver } from './application_final.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ApplicationFinal])],
  providers: [ApplicationFinalResolver, ApplicationFinalService],
})
export class ApplicationFinalModule {}
