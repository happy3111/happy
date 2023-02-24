import { Test, TestingModule } from '@nestjs/testing';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { countryDTO, countries } from './dto/country.dto';
import { MockType } from 'test/mocktype';

describe('CountryService', () => {
  let service: CountryService;
  let model: typeof Country;

  const countryRepositoryMock: MockType<Repository<Country>> = {
    create: jest.fn((country) => country),
    findOne: jest.fn(() => countryDTO),
    findAll: jest.fn(() => countries),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getModelToken(Country),
          useValue: countryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    model = module.get<typeof Country>(getModelToken(Country));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a country', async () => {
      expect(await service.create(countryDTO)).toEqual(countryDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of countries', async () => {
      const countries = await service.findAll({
        offset: 0,
        limit: 5,
      });
      expect(countries).toEqual(countries);
    });
  });

  describe('findOne()', () => {
    it('should get a single country', () => {
      expect(service.findOne('1')).toEqual(countryDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a country', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
