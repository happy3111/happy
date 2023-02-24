import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApplicationFinal } from './application_final.entity';
import { ApplicationFinalArgs } from './dto/application_final.args';
import { ApplicationFinalInput } from './dto/application_final.input';

@Injectable()
export class ApplicationFinalService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(ApplicationFinal)
    private readonly application_finalModel: typeof ApplicationFinal,
  ) {}

  create(data: ApplicationFinalInput): Promise<ApplicationFinal> {
    return this.application_finalModel.create(data as any);
  }

  async update(
    id: string,
    data: ApplicationFinalInput,
  ): Promise<ApplicationFinal> {
    await this.application_finalModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.application_finalModel.findByPk(id);
  }

  async findAll(
    application_finalArgs: ApplicationFinalArgs,
  ): Promise<ApplicationFinal[]> {
    return this.application_finalModel.findAll({
      include: ['application', 'final'],
      offset: application_finalArgs.offset,
      limit: application_finalArgs.limit,
    });
  }

  findOne({ applications_id, final_id }): Promise<ApplicationFinal> {
    return this.application_finalModel.findOne({
      where: {
        applications_id,
        final_id,
      },
      include: ['application', 'final'],
    });
  }

  async remove({ applications_id, final_id }): Promise<boolean> {
    const application_final = await this.application_finalModel.findOne({
      where: {
        applications_id,
        final_id,
      },
    });
    if (application_final) {
      await application_final.destroy();
      return true;
    } else return false;
  }
}
