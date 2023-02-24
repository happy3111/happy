import { Test, TestingModule } from '@nestjs/testing';
import { City } from './city.entity';
import { CityService } from './city.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { cityDTO, cities } from './dto/city.dto';
import { MockType } from 'test/mocktype';

describe('CityService', () => {
  let service: CityService;
  let model: typeof City;

  const cityRepositoryMock: MockType<Repository<City>> = {
    create: jest.fn((city) => city),
    findOne: jest.fn(() => cityDTO),
    findAll: jest.fn(() => cities),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getModelToken(City),
          useValue: cityRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    model = module.get<typeof City>(getModelToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a city', async () => {
      expect(await service.create(cityDTO)).toEqual(cityDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of cities', async () => {
      const cities = await service.findAll({
        offset: 0,
        limit: 5,
      });
      expect(cities).toEqual(cities);
    });
  });

  describe('findOne()', () => {
    it('should get a single city', () => {
      expect(service.findOne('1')).toEqual(cityDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a city', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
