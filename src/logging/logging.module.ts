import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggingService } from './logging.service';
import { ActionLog, FieldLog } from './logging.entity';
import { LoggingResolver } from './logging.resolver';
import { Country } from 'src/country/country.entity';
import { City } from 'src/city/city.entity';
import { Application } from 'src/application/application.entity';
import { ApplicationDatacenter } from 'src/application_datacenter/application_datacenter.entity';
import { ApplicationFinal } from 'src/application_final/application_final.entity';
import { ApplicationIcon } from 'src/application_icon/application_icon.entity';
import { ASN } from 'src/asn/asn.entity';
import { BridgeLatency } from 'src/bridge_latency/bridge_latency.entity';
import { Bridge } from 'src/bridge/bridge.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { DataCenterServer } from 'src/datacenter_server/datacenter_server.entity';
import { Final } from 'src/final/final.entity';
import { FinalBridge } from 'src/final_bridge/final_bridge.entity';
import { HostingCompany } from 'src/hosting_company/hosting_company.entity';
import { Prefix } from 'src/prefix/prefix.entity';
import { ServerIp } from 'src/serverIp/serverIp.entity';
import { Server } from 'src/server/server.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ActionLog,
      FieldLog,
      City,
      Country,
      Application,
      ApplicationDatacenter,
      ApplicationFinal,
      ApplicationIcon,
      ASN,
      Bridge,
      BridgeLatency,
      DataCenter,
      DataCenterServer,
      Final,
      FinalBridge,
      HostingCompany,
      Prefix,
      Server,
      ServerIp,
    ]),
  ],
  providers: [LoggingResolver, LoggingService],
})
export class LoggingModule {}
