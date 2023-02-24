import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BridgeService } from './bridge.service';
import { Bridge } from './bridge.entity';
import { BridgeResolver } from './bridge.resolver';
import { BridgeLatency } from 'src/bridge_latency/bridge_latency.entity';

@Module({
  imports: [SequelizeModule.forFeature([Bridge, BridgeLatency])],
  providers: [BridgeResolver, BridgeService],
})
export class BridgeModule {}
