import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FinalBridge } from './final_bridge.entity';
import { FinalBridgeInput } from './dto/final_bridge.input';
import { FinalInclude } from 'src/final/final.entity';
import { Bridge } from 'src/bridge/bridge.entity';
import { Server } from 'src/server/server.entity';

@Injectable()
export class FinalBridgeService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(FinalBridge)
    private readonly final_bridgeModel: typeof FinalBridge,
  ) {}

  create(data: FinalBridgeInput): Promise<FinalBridge> {
    return this.final_bridgeModel.create(data as any);
  }

  async update(
    final_id: string,
    bridges_id: string,
    data: FinalBridgeInput,
  ): Promise<FinalBridge> {
    await this.final_bridgeModel.update(data, {
      where: {
        final_id,
        bridges_id,
      },
      individualHooks: true,
    });
    return this.findOne({ final_id, bridges_id });
  }

  async update_mass(data: FinalBridgeInput[]): Promise<FinalBridge[]> {
    return this.final_bridgeModel.bulkCreate(data as any, {
      updateOnDuplicate: ['latency'],
    });
  }

  async findAll({ offset, limit }): Promise<FinalBridge[]> {
    return this.final_bridgeModel.findAll({
      include: [
        {
          model: Bridge,
          include: [
            {
              model: Server,
              include: ['ips'],
            },
          ],
        },
        FinalInclude,
      ],
      offset,
      limit,
    });
  }

  findOne({ final_id, bridges_id }): Promise<FinalBridge> {
    return this.final_bridgeModel.findOne({
      where: {
        final_id,
        bridges_id,
      },
      include: ['bridge', 'final'],
    });
  }

  async remove({ final_id, bridges_id }): Promise<boolean> {
    const final_bridge = await this.final_bridgeModel.findOne({
      where: {
        final_id,
        bridges_id,
      },
    });
    if (final_bridge) {
      await final_bridge.destroy();
      return true;
    } else return false;
  }
}
