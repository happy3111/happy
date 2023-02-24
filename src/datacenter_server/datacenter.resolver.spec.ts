// src/datacenter_server/datacenter_server.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import {
  datacenter_serverDTO,
  datacenter_servers,
} from './dto/datacenter_server.dto';
import { DataCenterServerResolver } from './datacenter_server.resolver';
import { DataCenterServerService } from './datacenter_server.service';

describe('DataCenterServerResolver', () => {
  let resolver: DataCenterServerResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataCenterServerResolver,
        {
          provide: DataCenterServerService,
          useFactory: () => ({
            create: jest.fn((datacenter_server) => ({
              id: '1',
              ...datacenter_server,
            })),
            findAll: jest.fn(() => datacenter_servers),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...datacenter_serverDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<DataCenterServerResolver>(DataCenterServerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('datacenter_server', () => {
    it('should find and return a datacenter_server', async () => {
      const datacenter_server = await resolver.datacenter_server('1');
      expect(datacenter_server).toEqual({
        id: '1',
        ...datacenter_serverDTO,
      });
    });
  });
  describe('datacenter_servers', () => {
    it('should find and return a list of datacenter_servers', async () => {
      const datacenter_servers = await resolver.datacenter_servers({
        limit: 25,
        offset: 0,
        // filter: {},
        exactMatch: false,
      });
      expect(datacenter_servers).toEqual(datacenter_servers);
    });
  });
  describe('createDataCenterServer', () => {
    it('should find and return a datacenter_server', async () => {
      const datacenter_server = await resolver.addDataCenterServer(
        datacenter_serverDTO,
      );
      expect(datacenter_server).toEqual({
        id: '1',
        ...datacenter_serverDTO,
      });
    });
  });
});
