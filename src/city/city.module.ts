import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CityService } from './city.service';
import { City } from './city.entity';
import { CityResolver } from './city.resolver';

@Module({
  imports: [SequelizeModule.forFeature([City])],
  providers: [CityResolver, CityService],
})
export class CityModule {}
