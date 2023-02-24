import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountryService } from './country.service';
import { Country } from './country.entity';
import { CountryResolver } from './country.resolver';
import { LoggingModule } from 'src/logging/logging.module';
import { ActionLog, FieldLog } from 'src/logging/logging.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Country, ActionLog, FieldLog]),
    LoggingModule,
  ],
  providers: [CountryResolver, CountryService],
})
export class CountryModule {}
