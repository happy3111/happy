import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from './server.entity';
import { ServerIp } from 'src/serverIp/serverIp.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { City } from 'src/city/city.entity';
import { DataCenterServer } from 'src/datacenter_server/datacenter_server.entity';
import { ServersArgs } from './dto/servers.args';
import { generate_where } from 'utils';
import { ServerInput } from './dto/server.input';

@Injectable()
export class ServerService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Server)
    private readonly serverModel: typeof Server,
    @InjectModel(ServerIp)
    private readonly serverIpModel: typeof ServerIp,
  ) {}

  getIpVersion(ip: string): number {
    return ip.indexOf('.') > 0 ? 4 : 6;
  }

  async create(data: ServerInput): Promise<Server> {
    const newServer = await this.serverModel.create(data as any);
    return newServer;
  }

  async update(id: string, data: ServerInput): Promise<Server> {
    if (data.ips) {
      await this.serverIpModel.destroy({ where: { server_id: id } });
      await this.serverIpModel.bulkCreate(
        data.ips.map((record) => ({ ...record, server_id: id })),
      );
    }
    await this.serverModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.serverModel.findByPk(id, {
      include: ['bridge', 'ips', 'datacenter'],
    });
  }

  async findAll(serverArgs: ServersArgs): Promise<Server[]> {
    const where = generate_where({
      filter: {
        hostname: serverArgs.filter?.hostname,
      },
      exactMatch: serverArgs.exactMatch,
    });
    return this.serverModel.findAll({
      include: [
        // "final", "bridge", "ips", "datacenter"
        'bridge',
        {
          model: ServerIp,
          where: generate_where({
            filter: {
              ip: serverArgs.filter?.ip,
              version: serverArgs.filter?.ip_version,
            },
            exactMatch: serverArgs.exactMatch,
          }),
        },
        'ips',
        'hosting_company',
        {
          model: DataCenterServer,
          include: [
            {
              model: DataCenter,
              include: [
                {
                  model: City,
                  include: ['country'],
                },
                'asn',
              ],
            },
          ],
        },
        {
          model: DataCenter,
          include: [
            {
              model: City,
              include: ['country'],
            },
            'asn',
          ],
        },
      ],
      where: where,
      offset: serverArgs.offset,
      limit: serverArgs.limit,
    });
  }

  findOne(id: string): Promise<Server> {
    return this.serverModel.findOne({
      where: {
        id,
      },
      include: [
        'bridge',
        'ips',
        'hosting_company',
        {
          model: DataCenterServer,
          include: [
            {
              model: DataCenter,
              include: [
                {
                  model: City,
                  include: ['country'],
                },
                'asn',
              ],
            },
          ],
        },
        {
          model: DataCenter,
          include: [
            {
              model: City,
              include: ['country'],
            },
            'asn',
          ],
        },
      ],
    });
  }

  async remove(id: string): Promise<boolean> {
    const server = await this.findOne(id);
    if (server) {
      await server.destroy();
      return true;
    } else return false;
  }
}
