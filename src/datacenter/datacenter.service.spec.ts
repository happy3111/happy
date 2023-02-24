import { Test, TestingModule } from '@nestjs/testing';
import { DataCenter } from './datacenter.entity';
import { DataCenterService } from './datacenter.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { datacenterDTO, datacenters } from './dto/datacenter.dto';
import { MockType } from 'test/mocktype';

describe('DataCenterService', () => {
  let service: DataCenterService;
  let model: typeof DataCenter;

  const datacenterRepositoryMock: MockType<Repository<DataCenter>> = {
    create: jest.fn((datacenter) => datacenter),
    findOne: jest.fn(() => datacenterDTO),
    findAll: jest.fn(() => datacenters),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataCenterService,
        {
          provide: getModelToken(DataCenter),
          useValue: datacenterRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DataCenterService>(DataCenterService);
    model = module.get<typeof DataCenter>(getModelToken(DataCenter));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a datacenter', async () => {
      expect(await service.create(datacenterDTO)).toEqual(datacenterDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of datacenters', async () => {
      const datacenters = await service.findAll({
        offset: 0,
        limit: 5,
        filter: {},
        exactMatch: false,
      });
      expect(datacenters).toEqual(datacenters);
    });
  });

  describe('findOne()', () => {
    it('should get a single datacenter', () => {
      expect(service.findOne('1')).toEqual(datacenterDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a datacenter', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
