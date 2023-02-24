import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from 'src/city/city.entity';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { ApplicationDatacenter } from './application_datacenter.entity';
import { ApplicationDatacenterArgs } from './dto/application_datacenter.args';
import { ApplicationDatacenterInput } from './dto/application_datacenter.input';

@Injectable()
export class ApplicationDatacenterService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(ApplicationDatacenter)
    private readonly application_datacenterModel: typeof ApplicationDatacenter,
  ) {}

  create(data: ApplicationDatacenterInput): Promise<ApplicationDatacenter> {
    return this.application_datacenterModel.create(data as any);
  }

  async update(
    id: string,
    data: ApplicationDatacenterInput,
  ): Promise<ApplicationDatacenter> {
    await this.application_datacenterModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.application_datacenterModel.findByPk(id);
  }

  async findAll(
    application_datacenterArgs: ApplicationDatacenterArgs,
  ): Promise<ApplicationDatacenter[]> {
    return this.application_datacenterModel.findAll({
      include: [
        'application',
        {
          model: DataCenter,
          include: [
            {
              model: City,
              include: ['country'],
            },
          ],
        },
      ],
      offset: application_datacenterArgs.offset,
      limit: application_datacenterArgs.limit,
    });
  }

  findOne({ application_id, server_id }): Promise<ApplicationDatacenter> {
    return this.application_datacenterModel.findOne({
      where: {
        application_id,
        server_id,
      },
      include: [
        'application',
        {
          model: DataCenter,
          include: [
            {
              model: City,
              include: ['country'],
            },
          ],
        },
      ],
    });
  }

  async remove({ application_id, server_id }): Promise<boolean> {
    const application_datacenter =
      await this.application_datacenterModel.findOne({
        where: {
          application_id,
          server_id,
        },
      });
    if (application_datacenter) {
      await application_datacenter.destroy();
      return true;
    } else return false;
  }
}
