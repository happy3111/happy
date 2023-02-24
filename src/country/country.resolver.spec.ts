// src/country/country.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CountryResolver } from './country.resolver';
import { CountryService } from './country.service';
import { countries, countryDTO } from './dto/country.dto';

describe('CountryResolver', () => {
  let resolver: CountryResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryResolver,
        {
          provide: CountryService,
          useFactory: () => ({
            create: jest.fn((country) => ({
              id: '1',
              ...country,
            })),
            findAll: jest.fn(() => countries),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...countryDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<CountryResolver>(CountryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('country', () => {
    it('should find and return a country', async () => {
      const country = await resolver.country('1');
      expect(country).toEqual({
        id: '1',
        ...countryDTO,
      });
    });
  });
  describe('countries', () => {
    it('should find and return a list of countries', async () => {
      const countries = await resolver.countries({
        limit: 25,
        offset: 0,
        exactMatch: false,
      });
      expect(countries).toEqual(countries);
    });
  });
  describe('createCountry', () => {
    it('should find and return a country', async () => {
      const country = await resolver.addCountry(countryDTO);
      expect(country).toEqual({
        id: '1',
        ...countryDTO,
      });
    });
  });
});
