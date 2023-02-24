import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bridge, BridgeInclude } from 'src/bridge/bridge.entity';
import { Server } from 'src/server/server.entity';
import { generate_where } from 'utils';
import { BridgeLatency } from './bridge_latency.entity';
import { BridgeLatencyInput } from './dto/bridge_latency.input';

@Injectable()
export class BridgeLatencyService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(BridgeLatency)
    private readonly bridge_latencyModel: typeof BridgeLatency,
  ) {}

  create(data: BridgeLatencyInput): Promise<BridgeLatency> {
    return this.bridge_latencyModel.create(data as any);
  }

  async update(id: string, data: BridgeLatencyInput): Promise<BridgeLatency> {
    await this.bridge_latencyModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.bridge_latencyModel.findByPk(id);
  }

  async findAll({
    offset,
    limit,
    filter,
    exactMatch,
  }): Promise<BridgeLatency[]> {
    return this.bridge_latencyModel.findAll({
      include: [
        {
          as: 'bridge_src',
          ...BridgeInclude,
        },
        // "bridge_dst",
        {
          as: 'bridge_dst',
          model: Bridge,
          include: [
            {
              model: Server,
              include: ['ips', 'hosting_company'],
            },
          ],
        },
      ],
      where: generate_where({ filter, exactMatch }),
      offset,
      limit,
    });
  }

  findOne({ bridge_src_id, bridge_dst_id }): Promise<BridgeLatency> {
    return this.bridge_latencyModel.findOne({
      where: {
        bridge_src_id,
        bridge_dst_id,
      },
      include: [
        // 'bridge_src', 'bridge_dst'
      ],
    });
  }

  async remove({ applications_id, final_id }): Promise<boolean> {
    const bridge_latency = await this.bridge_latencyModel.findOne({
      where: {
        applications_id,
        final_id,
      },
    });
    if (bridge_latency) {
      await bridge_latency.destroy();
      return true;
    } else return false;
  }

  async update_mass(data: BridgeLatencyInput[]): Promise<BridgeLatency[]> {
    return this.bridge_latencyModel.bulkCreate(data as any, {
      updateOnDuplicate: ['latency'],
    });
  }
}
