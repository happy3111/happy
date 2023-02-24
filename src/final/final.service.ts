import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServerInclude } from 'src/server/server.entity';
import { Final } from './final.entity';
import { FinalInput } from './dto/final.input';
import { Application } from 'src/application/application.entity';
import {
  FinalBridge,
  FinalBridgeInput,
} from 'src/final_bridge/final_bridge.entity';
import { generate_where } from 'utils';
import { FinalArgs } from './dto/final.args';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class FinalService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Final)
    private readonly finalModel: typeof Final,
  ) {}

  create(data: FinalInput): Promise<Final> {
    return this.finalModel.create(data as any);
  }

  async update(id: string, data: FinalInput): Promise<Final> {
    this.finalModel.beforeUpdate(
      (instance) =>
        (instance['user_id'] = RequestContext.currentContext.req.user.id),
    );
    await this.finalModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.finalModel.findByPk(id);
  }

  async findAll(finalArgs: FinalArgs): Promise<Final[]> {
    return this.finalModel.findAll({
      include: [
        {
          model: Application,
        },
        ServerInclude,
        {
          model: FinalBridge,
          include: ['bridge'],
        },
        'datacenter',
      ],
      where: generate_where(finalArgs),
      offset: finalArgs.offset,
      limit: finalArgs.limit,
    });
  }

  findOne(id: string): Promise<Final> {
    return this.finalModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Application,
        },
        ServerInclude,
        FinalBridgeInput,
        'datacenter',
      ],
    });
  }

  async remove(id: string): Promise<boolean> {
    const final = await this.findOne(id);
    if (final) {
      await final.destroy();
      return true;
    } else return false;
  }
}
