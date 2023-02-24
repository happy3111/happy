import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './country.entity';
import { CountryInput } from './dto/country.input';

@Injectable()
export class CountryService {
  constructor(
    // @Inject(CONTEXT) private readonly context: any,
    @InjectModel(Country)
    private readonly countryModel: typeof Country,
  ) {}

  create(data: CountryInput): Promise<Country> {
    return this.countryModel.create(data as any);
  }

  async update(id: string, data: CountryInput): Promise<Country> {
    // this.countryModel.beforeUpdate((instance) => instance['user_id'] = RequestContext.currentContext.req.user.id)
    await this.countryModel.update(data, {
      where: {
        id: id,
      },
      individualHooks: true,
    });
    return this.countryModel.findByPk(id);
  }

  async findAll({ offset, limit }): Promise<Country[]> {
    return this.countryModel.findAll({
      include: [],
      offset,
      limit,
    });
  }

  findOne(id: string): Promise<Country> {
    return this.countryModel.findOne({
      where: {
        id,
      },
      include: [],
    });
  }

  async remove(id: string): Promise<boolean> {
    const country = await this.findOne(id);
    if (country) {
      await country.destroy();
      return true;
    } else return false;
  }
}
