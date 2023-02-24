// src/bridge/bridge.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BridgeResolver } from './bridge.resolver';
import { BridgeService } from './bridge.service';
import { bridges, bridgeDTO } from './dto/bridges.dto';

describe('BridgeResolver', () => {
  let resolver: BridgeResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BridgeResolver,
        {
          provide: BridgeService,
          useFactory: () => ({
            create: jest.fn((bridge) => ({
              id: '1',
              ...bridge,
            })),
            findAll: jest.fn(() => bridges),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...bridgeDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<BridgeResolver>(BridgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('bridge', () => {
    it('should find and return a bridge', async () => {
      const bridge = await resolver.bridge('1');
      expect(bridge).toEqual({
        id: '1',
        ...bridgeDTO,
      });
    });
  });
  describe('bridges', () => {
    it('should find and return a list of bridges', async () => {
      const bridges = await resolver.bridges({
        limit: 25,
        offset: 0,
        filter: {},
        exactMatch: false,
      });
      expect(bridges).toEqual(bridges);
    });
  });
  describe('createBridge', () => {
    it('should find and return a bridge', async () => {
      const bridge = await resolver.addBridge(bridgeDTO);
      expect(bridge).toEqual({
        id: '1',
        ...bridgeDTO,
      });
    });
  });
});
