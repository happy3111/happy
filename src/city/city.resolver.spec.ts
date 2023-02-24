// src/city/city.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CityResolver } from './city.resolver';
import { CityService } from './city.service';
import { cities, cityDTO } from './dto/city.dto';

describe('CityResolver', () => {
  let resolver: CityResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityResolver,
        {
          provide: CityService,
          useFactory: () => ({
            create: jest.fn((city) => ({
              id: '1',
              ...city,
            })),
            findAll: jest.fn(() => cities),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...cityDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<CityResolver>(CityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('city', () => {
    it('should find and return a city', async () => {
      const city = await resolver.city('1');
      expect(city).toEqual({
        id: '1',
        ...cityDTO,
      });
    });
  });
  describe('cities', () => {
    it('should find and return a list of cities', async () => {
      const cities = await resolver.cities({
        limit: 25,
        offset: 0,
        exactMatch: false,
      });
      expect(cities).toEqual(cities);
    });
  });
  describe('createCity', () => {
    it('should find and return a city', async () => {
      const city = await resolver.addCity(cityDTO);
      expect(city).toEqual({
        id: '1',
        ...cityDTO,
      });
    });
  });
});
