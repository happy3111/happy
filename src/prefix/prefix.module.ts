import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PrefixService } from './prefix.service';
import { Prefix } from './prefix.entity';
import { PrefixResolver } from './prefix.resolver';

@Module({
  imports: [SequelizeModule.forFeature([Prefix])],
  providers: [PrefixResolver, PrefixService],
})
export class PrefixModule {}
