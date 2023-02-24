import { Test, TestingModule } from '@nestjs/testing';
import { HostingCompany } from './hosting_company.entity';
import { HostingCompanyService } from './hosting_company.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import {
  hosting_companyDTO,
  hosting_companies,
} from './dto/hosting_company.dto';
import { MockType } from 'test/mocktype';

describe('HostingCompanyService', () => {
  let service: HostingCompanyService;
  let model: typeof HostingCompany;

  const hosting_companyRepositoryMock: MockType<Repository<HostingCompany>> = {
    create: jest.fn((hosting_company) => hosting_company),
    findOne: jest.fn(() => hosting_companyDTO),
    findAll: jest.fn(() => hosting_companies),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostingCompanyService,
        {
          provide: getModelToken(HostingCompany),
          useValue: hosting_companyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<HostingCompanyService>(HostingCompanyService);
    model = module.get<typeof HostingCompany>(getModelToken(HostingCompany));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a hosting_company', async () => {
      expect(await service.create(hosting_companyDTO)).toEqual(
        hosting_companyDTO,
      );
    });
  });

  describe('findAll()', () => {
    it('should return an array of hosting_companys', async () => {
      const hosting_companys = await service.findAll({
        offset: 0,
        limit: 5,
        filter: {},
        exactMatch: false,
      });
      expect(hosting_companys).toEqual(hosting_companys);
    });
  });

  describe('findOne()', () => {
    it('should get a single hosting_company', () => {
      expect(service.findOne('1')).toEqual(hosting_companyDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a hosting_company', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
