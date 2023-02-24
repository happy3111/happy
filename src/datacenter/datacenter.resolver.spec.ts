// src/datacenter/datacenter.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { datacenterDTO, datacenters } from './dto/datacenter.dto';
import { DataCenterResolver } from './datacenter.resolver';
import { DataCenterService } from './datacenter.service';

describe('DataCenterResolver', () => {
  let resolver: DataCenterResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataCenterResolver,
        {
          provide: DataCenterService,
          useFactory: () => ({
            create: jest.fn((datacenter) => ({
              id: '1',
              ...datacenter,
            })),
            findAll: jest.fn(() => datacenters),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...datacenterDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<DataCenterResolver>(DataCenterResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('datacenter', () => {
    it('should find and return a datacenter', async () => {
      const datacenter = await resolver.datacenter('1');
      expect(datacenter).toEqual({
        id: '1',
        ...datacenterDTO,
      });
    });
  });
  describe('datacenters', () => {
    it('should find and return a list of datacenters', async () => {
      const datacenters = await resolver.datacenters({
        limit: 25,
        offset: 0,
        filter: {},
        exactMatch: false,
      });
      expect(datacenters).toEqual(datacenters);
    });
  });
  describe('createDataCenter', () => {
    it('should find and return a datacenter', async () => {
      const datacenter = await resolver.addDataCenter(datacenterDTO);
      expect(datacenter).toEqual({
        id: '1',
        ...datacenterDTO,
      });
    });
  });
});
