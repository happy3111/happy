import { MiddlewareConsumer, Module, Request } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { config } from 'dotenv';
config();
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BridgeModule } from './bridge/bridge.module';
import { GraphQLDirective, DirectiveLocation } from 'graphql';
import { ServerModule } from './server/server.module';
import { DataCenterModule } from './datacenter/datacenter.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { ASNModule } from './asn/asn.module';
import { FinalModule } from './final/final.module';
import { ServerIpModule } from './serverIp/serverIp.module';
import { DataCenterServerModule } from './datacenter_server/datacenter_server.module';
import { FinalBridgeModule } from './final_bridge/final_bridge.module';
import { ApplicationModule } from './application/application.module';
import { ApplicationDatacenterModule } from './application_datacenter/application_datacenter.module';
import { ApplicationIconModule } from './application_icon/application_icon.module';
import { HostingCompanyModule } from './hosting_company/hosting_company.module';
import { PrefixModule } from './prefix/prefix.module';
import { ApplicationFinalModule } from './application_final/application_final.module';
import { BridgeLatencyModule } from './bridge_latency/bridge_latency.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { User } from './auth/auth.entity';
import { LoggingModule } from './logging/logging.module';
import { RequestContextModule } from 'nestjs-request-context';

@Module({
  imports: [
    RequestContextModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      define: {
        timestamps: false,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      context: ({}) => ({ req: Request }),
    }),
    SequelizeModule.forFeature([User]),
    LoggingModule,
    ServerIpModule,
    BridgeModule,
    ServerModule,
    DataCenterModule,
    CountryModule,
    CityModule,
    ASNModule,
    FinalModule,
    DataCenterServerModule,
    FinalBridgeModule,
    ApplicationModule,
    ApplicationDatacenterModule,
    ApplicationFinalModule,
    ApplicationIconModule,
    HostingCompanyModule,
    PrefixModule,
    BridgeLatencyModule,
    AuthModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer;
    // .apply(mung.write(function(chunk, encoding, req, res){
    //   console.log('mung');
    //   return chunk;
    // }))
    // .apply(mung.json(function(chunk, req, res){
    //   console.log('mung');
    //   return chunk;
    // }))
    // .apply((req, res, next) => {
    //   console.log('hello mung');
    // })
    // .forRoutes('*')
  }
}
