import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ASNService } from './asn.service';
import { ASN } from './asn.entity';
import { ASNResolver } from './asn.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ASN])],
  providers: [ASNResolver, ASNService],
})
export class ASNModule {}
