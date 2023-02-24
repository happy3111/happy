import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Prefix } from './prefix.entity';
import { PrefixInput } from './dto/prefix.input';
import { DataCenterInclude } from 'src/datacenter/datacenter.entity';
import { PrefixArgs } from './dto/prefix.args';
import { Op } from 'sequelize';
import * as ipInt from 'ip-to-int';

@Injectable()
export class PrefixService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Prefix)
    private readonly prefixModel: typeof Prefix,
  ) {}

  create(data: PrefixInput): Promise<Prefix> {
    return this.prefixModel.create(data as any);
  }

  async update(id: string, data: PrefixInput): Promise<Prefix> {
    await this.prefixModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.prefixModel.findByPk(id);
  }

  async findAll(prefixArgs: PrefixArgs): Promise<Prefix[]> {
    return this.prefixModel.findAll({
      include: [DataCenterInclude],
      where: prefixArgs?.filter?.ip
        ? {
            ip_range_ini: { [Op.lte]: ipInt(prefixArgs.filter.ip).toInt() },
            ip_range_end: { [Op.gte]: ipInt(prefixArgs.filter.ip).toInt() },
          }
        : {},
      offset: prefixArgs.offset,
      limit: prefixArgs.limit,
    });
  }

  findOne(id: string): Promise<Prefix> {
    return this.prefixModel.findOne({
      where: {
        id,
      },
      include: [DataCenterInclude],
    });
  }

  async remove(id: string): Promise<boolean> {
    const prefix = await this.findOne(id);
    if (prefix) {
      await prefix.destroy();
      return true;
    } else return false;
  }
}
