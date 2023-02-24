// src/hosting_company/hosting_company.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import {
  hosting_companyDTO,
  hosting_companies,
} from './dto/hosting_company.dto';
import { HostingCompanyResolver } from './hosting_company.resolver';
import { HostingCompanyService } from './hosting_company.service';

describe('HostingCompanyResolver', () => {
  let resolver: HostingCompanyResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostingCompanyResolver,
        {
          provide: HostingCompanyService,
          useFactory: () => ({
            create: jest.fn((hosting_company) => ({
              id: '1',
              ...hosting_company,
            })),
            findAll: jest.fn(() => hosting_companies),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...hosting_companyDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<HostingCompanyResolver>(HostingCompanyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('hosting_company', () => {
    it('should find and return a hosting_company', async () => {
      const hosting_company = await resolver.hosting_company('1');
      expect(hosting_company).toEqual({
        id: '1',
        ...hosting_companyDTO,
      });
    });
  });
  describe('hosting_companys', () => {
    it('should find and return a list of hosting_companys', async () => {
      const hosting_companys = await resolver.hosting_companies({
        limit: 25,
        offset: 0,
        filter: {},
        exactMatch: false,
      });
      expect(hosting_companys).toEqual(hosting_companys);
    });
  });
  describe('createHostingCompany', () => {
    it('should find and return a hosting_company', async () => {
      const hosting_company = await resolver.addHostingCompany(
        hosting_companyDTO,
      );
      expect(hosting_company).toEqual({
        id: '1',
        ...hosting_companyDTO,
      });
    });
  });
});
