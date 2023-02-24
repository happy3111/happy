import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServerIp } from './serverIp.entity';
import { ServerIpInput } from './dto/serverIp.input';
import { Server } from 'src/server/server.entity';
import { ServerIpArgs } from './dto/serverIp.args';
import { generate_where } from 'utils';

@Injectable()
export class ServerIpService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(ServerIp)
    private readonly serverIpModel: typeof ServerIp,
  ) {}

  create(data: ServerIpInput): Promise<ServerIp> {
    return this.serverIpModel.create(data as any);
  }

  async update(id: string, data: ServerIpInput): Promise<ServerIp> {
    await this.serverIpModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.serverIpModel.findByPk(id);
  }

  async findAll(args: ServerIpArgs): Promise<ServerIp[]> {
    return this.serverIpModel.findAll({
      include: [{ model: Server }],
      offset: args.offset,
      limit: args.limit,
      where: generate_where(args),
    });
  }

  findOne(id: string): Promise<ServerIp> {
    return this.serverIpModel.findOne({
      where: {
        id,
      },
      include: [{ model: Server }],
    });
  }

  async remove(id: string): Promise<boolean> {
    const serverIp = await this.findOne(id);
    if (serverIp) {
      await serverIp.destroy();
      return true;
    } else return false;
  }
}
