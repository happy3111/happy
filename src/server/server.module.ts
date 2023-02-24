import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServerService } from './server.service';
import { Server } from './server.entity';
import { TransactionInterceptor } from '../transaction.interceptor';
import { Sequelize } from 'sequelize-typescript';
import { ServerResolver } from './server.resolver';
import { ServerIp } from 'src/serverIp/serverIp.entity';
@Module({
  imports: [SequelizeModule.forFeature([Server, ServerIp])],

  providers: [
    { provide: 'SEQUELIZE', useExisting: Sequelize },
    ServerService,
    TransactionInterceptor,
    ServerResolver,
  ],
})
export class ServerModule {}
