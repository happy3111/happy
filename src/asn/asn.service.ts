import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { generate_where } from 'utils';
import { ASN } from './asn.entity';
import { ASNArgs } from './dto/asn.args';
import { ASNInput } from './dto/asn.input';

@Injectable()
export class ASNService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(ASN)
    private readonly asnModel: typeof ASN,
  ) {}

  create(data: ASNInput): Promise<ASN> {
    return this.asnModel.create(data as any);
  }

  async update(id: string, data: ASNInput): Promise<ASN> {
    await this.asnModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.asnModel.findByPk(id);
  }

  async findAll(asnArgs: ASNArgs): Promise<ASN[]> {
    return this.asnModel.findAll({
      include: [],
      where: generate_where(asnArgs),
      offset: asnArgs.offset,
      limit: asnArgs.limit,
    });
  }

  findOne(id: string): Promise<ASN> {
    return this.asnModel.findOne({
      where: {
        id,
      },
      include: [],
    });
  }

  async remove(id: string): Promise<boolean> {
    const asn = await this.findOne(id);
    if (asn) {
      await asn.destroy();
      return true;
    } else return false;
  }
}
