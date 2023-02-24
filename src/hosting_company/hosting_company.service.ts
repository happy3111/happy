import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HostingCompany } from './hosting_company.entity';
import { HostingCompanyInput } from './dto/hosting_company.input';
import { HostingCompanyArgs } from './dto/hosting_company.args';
import { generate_where } from 'utils';

@Injectable()
export class HostingCompanyService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(HostingCompany)
    private readonly hosting_companyModel: typeof HostingCompany,
  ) {}

  create(data: HostingCompanyInput): Promise<HostingCompany> {
    return this.hosting_companyModel.create(data as any);
  }

  async update(id: string, data: HostingCompanyInput): Promise<HostingCompany> {
    await this.hosting_companyModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.hosting_companyModel.findByPk(id);
  }

  async findAll(
    hosting_companyArgs: HostingCompanyArgs,
  ): Promise<HostingCompany[]> {
    return this.hosting_companyModel.findAll({
      include: [],
      where: generate_where(hosting_companyArgs),
      offset: hosting_companyArgs.offset,
      limit: hosting_companyArgs.limit,
    });
  }

  findOne(id: string): Promise<HostingCompany> {
    return this.hosting_companyModel.findOne({
      where: {
        id,
      },
      include: [],
    });
  }

  async remove(id: string): Promise<boolean> {
    const hosting_company = await this.findOne(id);
    if (hosting_company) {
      await hosting_company.destroy();
      return true;
    } else return false;
  }
}
