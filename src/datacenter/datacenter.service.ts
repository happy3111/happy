import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityInclude } from 'src/city/city.entity';
import { generate_where } from 'utils';
import { DataCenter } from './datacenter.entity';
import { DataCenterArgs } from './dto/datacenter.args';
import { DataCenterInput } from './dto/datacenter.input';

@Injectable()
export class DataCenterService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(DataCenter)
    private readonly datacenterModel: typeof DataCenter,
  ) {}

  create(data: DataCenterInput): Promise<DataCenter> {
    return this.datacenterModel.create(data as any);
  }

  async update(id: string, data: DataCenterInput): Promise<DataCenter> {
    await this.datacenterModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.datacenterModel.findByPk(id);
  }

  async findAll(datacenterArgs: DataCenterArgs): Promise<DataCenter[]> {
    const where = generate_where({
      filter: {
        '$asn.code$': datacenterArgs.filter?.asn_code,
        '$asn.name$': datacenterArgs.filter?.asn_name,
        '$city.name$': datacenterArgs.filter?.city,
        '$city.country.name$': datacenterArgs.filter?.country,
      },
      exactMatch: datacenterArgs.exactMatch,
    });
    return this.datacenterModel.findAll({
      include: [CityInclude, 'asn', 'prefixes'],
      where,
      offset: datacenterArgs.offset,
      limit: datacenterArgs.limit,
    });
  }

  findOne(id: string): Promise<DataCenter> {
    return this.datacenterModel.findOne({
      where: {
        id,
      },
      include: ['city', 'asn'],
    });
  }

  async remove(id: string): Promise<boolean> {
    const datacenter = await this.findOne(id);
    if (datacenter) {
      await datacenter.destroy();
      return true;
    } else return false;
  }
}
