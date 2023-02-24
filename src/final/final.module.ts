import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FinalService } from './final.service';
import { Final } from './final.entity';
import { FinalResolver } from './final.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Final])],
  providers: [FinalResolver, FinalService],
})
export class FinalModule {}
