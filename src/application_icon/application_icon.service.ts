import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApplicationIcon } from './application_icon.entity';
import { ApplicationIconInput } from './dto/application_icon.input';

@Injectable()
export class ApplicationIconService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(ApplicationIcon)
    private readonly application_iconModel: typeof ApplicationIcon,
  ) {}

  create(data: ApplicationIconInput): Promise<ApplicationIcon> {
    return this.application_iconModel.create(data as any);
  }

  async update(
    id: string,
    data: ApplicationIconInput,
  ): Promise<ApplicationIcon> {
    await this.application_iconModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.application_iconModel.findByPk(id);
  }

  async findAll({ offset, limit }): Promise<ApplicationIcon[]> {
    return this.application_iconModel.findAll({
      include: [
        // 'application',
        // 'final'
      ],
      offset,
      limit,
    });
  }

  findOne({ applications_id, final_id }): Promise<ApplicationIcon> {
    return this.application_iconModel.findOne({
      where: {
        applications_id,
        final_id,
      },
      include: [
        // 'application',
        // 'final'
      ],
    });
  }

  async remove({ applications_id, final_id }): Promise<boolean> {
    const application_icon = await this.application_iconModel.findOne({
      where: {
        applications_id,
        final_id,
      },
    });
    if (application_icon) {
      await application_icon.destroy();
      return true;
    } else return false;
  }
}
