import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FinalBridgeService } from './final_bridge.service';
import { FinalBridge } from './final_bridge.entity';
import { FinalBridgeResolver } from './final_bridge.resolver';

@Module({
  imports: [SequelizeModule.forFeature([FinalBridge])],
  providers: [FinalBridgeResolver, FinalBridgeService],
})
export class FinalBridgeModule {}
