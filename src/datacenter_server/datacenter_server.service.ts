import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataCenterServer } from './datacenter_server.entity';
import { DataCenterServerInput } from './dto/datacenter_server.input';

@Injectable()
export class DataCenterServerService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(DataCenterServer)
    private readonly datacenter_serverModel: typeof DataCenterServer,
  ) {}

  create(data: DataCenterServerInput): Promise<DataCenterServer> {
    return this.datacenter_serverModel.create(data as any);
  }

  async update(
    id: string,
    data: DataCenterServerInput,
  ): Promise<DataCenterServer> {
    await this.datacenter_serverModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.datacenter_serverModel.findByPk(id);
  }

  async findAll({ offset, limit }): Promise<DataCenterServer[]> {
    return this.datacenter_serverModel.findAll({
      include: ['server', 'datacenter'],
      offset,
      limit,
    });
  }

  findOne({ datacenter_id, server_id }): Promise<DataCenterServer> {
    return this.datacenter_serverModel.findOne({
      where: {
        datacenter_id,
        server_id,
      },
      include: ['server', 'datacenter'],
    });
  }

  async remove({ datacenter_id, server_id }): Promise<boolean> {
    const datacenter_server = await this.datacenter_serverModel.findOne({
      where: {
        datacenter_id,
        server_id,
      },
    });
    if (datacenter_server) {
      await datacenter_server.destroy();
      return true;
    } else return false;
  }
}
