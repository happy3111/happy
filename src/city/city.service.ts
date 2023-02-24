import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './city.entity';
import { CityInput } from './dto/city.input';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class CityService {
  constructor(
    //    @Inject(CONTEXT) private readonly context: any,
    @InjectModel(City)
    private readonly cityModel: typeof City,
  ) {}

  create(data: CityInput): Promise<City> {
    return this.cityModel.create(data as any);
  }

  async update(id: string, data: CityInput): Promise<City> {
    this.cityModel.beforeUpdate(
      (instance) =>
        (instance['user_id'] = RequestContext.currentContext.req.user.id),
    );
    await this.cityModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.cityModel.findByPk(id);
  }

  async findAll({ offset, limit }): Promise<City[]> {
    return this.cityModel.findAll({
      include: ['country'],
      offset,
      limit,
    });
  }

  findOne(id: string): Promise<City> {
    return this.cityModel.findOne({
      where: {
        id,
      },
      include: ['country'],
    });
  }

  async remove(id: string): Promise<boolean> {
    const city = await this.findOne(id);
    if (city) {
      await city.destroy();
      return true;
    } else return false;
  }
}
