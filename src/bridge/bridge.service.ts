import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bridge } from './bridge.entity';
import { Server, ServerInclude } from 'src/server/server.entity';
import {
  FinalBridge,
  FinalBridgeInput,
} from 'src/final_bridge/final_bridge.entity';
import { BridgeArgs } from './dto/bridges.args';
import { generate_where } from 'utils';
import { Final } from 'src/final/final.entity';
import { BridgeInput } from './dto/bridge.input';
import { BridgeLatency } from 'src/bridge_latency/bridge_latency.entity';

@Injectable()
export class BridgeService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Bridge)
    private readonly bridgeModel: typeof Bridge,
    @InjectModel(BridgeLatency)
    private readonly bridge_latencyModel: typeof BridgeLatency,
  ) {}

  async create(data: BridgeInput): Promise<Bridge> {
    const allBridges = await this.bridgeModel.findAll({ attributes: ['id'] });
    const bridge = await this.bridgeModel.create(data as any);
    const bridgeIds = allBridges.map((each) => each.id);
    await this.bridge_latencyModel.bulkCreate([
      ...bridgeIds.map((id) => ({
        bridge_src_id: bridge.id,
        bridge_dst_id: id,
      })),
      ...bridgeIds.map((id) => ({
        bridge_src_id: id,
        bridge_dst_id: bridge.id,
      })),
    ]);
    return bridge;
  }

  async update(id: string, data: BridgeInput): Promise<Bridge> {
    await this.bridgeModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.bridgeModel.findByPk(id);
  }

  async findAll(bridgesArgs: BridgeArgs): Promise<Bridge[]> {
    // $server.datacenter.city.country.name$
    return this.bridgeModel.findAll({
      include: [
        ServerInclude,
        {
          model: FinalBridge,
          include: [
            {
              model: Final,
              include: [
                'applications',
                {
                  model: Server,
                  include: ['ips', 'hosting_company'],
                },
              ],
            },
          ],
        },
      ],
      where: generate_where(bridgesArgs),
      offset: bridgesArgs.offset,
      limit: bridgesArgs.limit,
    });
  }

  findOne(id: string): Promise<Bridge> {
    return this.bridgeModel.findOne({
      where: {
        id,
      },
      include: [ServerInclude, FinalBridgeInput],
    });
  }

  async remove(id: string): Promise<boolean> {
    const bridge = await this.findOne(id);
    if (bridge) {
      await bridge.destroy();
      return true;
    } else return false;
  }
}
