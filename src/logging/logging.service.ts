import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActionLog, FieldLog } from './logging.entity';
import { ActionLogInput } from './dto/action_log.input';
import { Application } from 'src/application/application.entity';
import { generate_where } from 'utils';
import { ActionLogArgs } from './dto/action_log.args';
import { City } from 'src/city/city.entity';
import { Country } from 'src/country/country.entity';
import { RequestContext } from 'nestjs-request-context';
import { ASN } from 'src/asn/asn.entity';
import { ApplicationDatacenter } from 'src/application_datacenter/application_datacenter.entity';
import { ApplicationFinal } from 'src/application_final/application_final.entity';
import { ApplicationIcon } from 'src/application_icon/application_icon.entity';
import { Bridge } from 'src/bridge/bridge.entity';
import { BridgeLatency } from 'src/bridge_latency/bridge_latency.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { DataCenterServer } from 'src/datacenter_server/datacenter_server.entity';
import { Final } from 'src/final/final.entity';
import { FinalBridge } from 'src/final_bridge/final_bridge.entity';
import { HostingCompany } from 'src/hosting_company/hosting_company.entity';
import { Prefix } from 'src/prefix/prefix.entity';
import { Server } from 'http';
import { ServerIp } from 'src/serverIp/serverIp.entity';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class LoggingService {
  constructor(
    @InjectModel(ActionLog)
    private readonly actionLogModel: typeof ActionLog,
    @InjectModel(FieldLog)
    private readonly fieldLogModel: typeof FieldLog,
    @InjectModel(Country)
    private readonly countryModel: typeof Country,
    @InjectModel(City)
    private readonly cityModel: typeof City,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(ApplicationDatacenter)
    private readonly applicationDataCenterModel: typeof ApplicationDatacenter,
    @InjectModel(ApplicationFinal)
    private readonly applicationFinalModel: typeof ApplicationFinal,
    @InjectModel(ApplicationIcon)
    private readonly applicationIconModel: typeof ApplicationIcon,
    @InjectModel(ASN)
    private readonly asnModel: typeof ASN,
    @InjectModel(Bridge)
    private readonly bridgeModel: typeof Bridge,
    @InjectModel(BridgeLatency)
    private readonly bridgeLatencyModel: typeof BridgeLatency,
    @InjectModel(DataCenter)
    private readonly dataCenterModel: typeof DataCenter,
    @InjectModel(DataCenterServer)
    private readonly dataCenterServerModel: typeof DataCenterServer,
    @InjectModel(Final)
    private readonly finalModel: typeof Final,
    @InjectModel(FinalBridge)
    private readonly finalBridgeModel: typeof FinalBridge,
    @InjectModel(HostingCompany)
    private readonly hostingCompanyModel: typeof HostingCompany,
    @InjectModel(Prefix)
    private readonly prefixModel: typeof Prefix,
    @InjectModel(Server)
    private readonly serverModel: typeof Server,
    @InjectModel(ServerIp)
    private readonly serverIpModel: typeof ServerIp,
  ) {
    this.setupHook(this.countryModel);
    this.setupHook(this.cityModel);
    this.setupHook(this.applicationModel);
    this.setupHook(this.applicationDataCenterModel);
    this.setupHook(this.applicationFinalModel);
    this.setupHook(this.applicationIconModel);
    this.setupHook(this.asnModel);
    this.setupHook(this.bridgeModel);
    this.setupHook(this.bridgeLatencyModel);
    this.setupHook(this.dataCenterModel);
    this.setupHook(this.dataCenterServerModel);
    this.setupHook(this.finalModel);
    this.setupHook(this.finalBridgeModel);
    this.setupHook(this.hostingCompanyModel);
    this.setupHook(this.prefixModel);
    this.setupHook(this.serverModel);
    this.setupHook(this.serverIpModel);
  }

  setupHook = (model) => {
    model.addHook(
      'beforeUpdate',
      (instance) =>
        (instance['user_id'] = RequestContext.currentContext.req.user.id),
    );
    model.addHook('afterUpdate', this.hook);
  };

  hook = (instance: any) => {
    // console.log("hook", this.request.user); // new values
    const changed_fields = Array.from(instance._changed);
    // console.info('hook', instance);
    // console.log('hook', changed_fields, this.context.req);
    this.create({
      action: instance.isNewRecord ? 'create' : 'update',
      target_id: instance.dataValues['id'],
      user_id: instance.user_id,
      schema: instance.constructor.name,
      changed_fields: changed_fields.map((field) => ({
        field: field as string,
        old_value: instance._previousDataValues[field as string],
        new_value: instance.dataValues[field as string],
      })),
    });
    // console.log(instance._previousDataValues); // current values
  };

  async create(data: ActionLogInput): Promise<ActionLog> {
    const actionLog = await this.actionLogModel.create(data as any);
    await this.fieldLogModel.bulkCreate(
      data.changed_fields.map((row) => ({
        ...row,
        action_log_id: actionLog.id,
      })),
    );
    return actionLog;
  }

  async update(id: string, data: ActionLogInput): Promise<ActionLog> {
    await this.actionLogModel.update(data, {
      where: {
        id: id,
      },
    });
    return this.actionLogModel.findByPk(id);
  }

  async findAll(actionLogArgs: ActionLogArgs): Promise<ActionLog[]> {
    return this.actionLogModel.findAll({
      include: ['user', 'changed_fields'],
      where: generate_where(actionLogArgs),
      offset: actionLogArgs.offset,
      limit: actionLogArgs.limit,
    });
  }

  findOne(id: string): Promise<ActionLog> {
    return this.actionLogModel.findOne({
      where: {
        id,
      },
      include: ['user', 'changed_fields'],
    });
  }

  async remove(id: string): Promise<boolean> {
    const actionLog = await this.findOne(id);
    if (actionLog) {
      await actionLog.destroy();
      return true;
    } else return false;
  }
}
