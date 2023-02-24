import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BridgeLatencyService } from './bridge_latency.service';
import { BridgeLatency } from './bridge_latency.entity';
import { BridgeLatencyResolver } from './bridge_latency.resolver';

@Module({
  imports: [SequelizeModule.forFeature([BridgeLatency])],
  providers: [BridgeLatencyResolver, BridgeLatencyService],
})
export class BridgeLatencyModule {}
