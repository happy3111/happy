import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataCenter } from 'src/datacenter/datacenter.entity';
import { Final, FinalInclude } from 'src/final/final.entity';
import { generate_where } from 'utils';
import { Application } from './application.entity';
import { ApplicationArgs } from './dto/application.args';
import { ApplicationInput } from './dto/application.input';

@Injectable()
export class ApplicationService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
  ) {}

  create(data: ApplicationInput): Promise<Application> {
    return this.applicationModel.create(data as any);
  }

  async update(id: string, data: ApplicationInput): Promise<Application> {
    await this.applicationModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.applicationModel.findByPk(id);
  }

  async findAll(applicationArgs: ApplicationArgs): Promise<Application[]> {
    return this.applicationModel.findAll({
      include: [
        'icon',
        {
          model: DataCenter,
        },
        FinalInclude,
      ],
      where: generate_where(applicationArgs),
      offset: applicationArgs.offset,
      limit: applicationArgs.limit,
    });
  }

  findOne(id: string): Promise<Application> {
    return this.applicationModel.findOne({
      where: {
        id,
      },
      include: [
        'icon',
        {
          model: DataCenter,
        },
        {
          model: Final,
        },
      ],
    });
  }

  async remove(id: string): Promise<boolean> {
    const application = await this.findOne(id);
    if (application) {
      await application.destroy();
      return true;
    } else return false;
  }
}
