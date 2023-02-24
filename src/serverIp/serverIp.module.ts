import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServerIpService } from './serverIp.service';
import { ServerIp } from './serverIp.entity';
import { ServerIpResolver } from './serverIp.resolver';

@Module({
  imports: [SequelizeModule.forFeature([ServerIp])],
  providers: [ServerIpResolver, ServerIpService],
})
export class ServerIpModule {}
