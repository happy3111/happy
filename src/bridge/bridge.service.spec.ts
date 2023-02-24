import { Test, TestingModule } from '@nestjs/testing';
import { Bridge } from './bridge.entity';
import { BridgeService } from './bridge.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { bridgeDTO, bridges } from './dto/bridges.dto';
import { MockType } from 'test/mocktype';
import { BridgeLatency } from 'src/bridge_latency/bridge_latency.entity';

describe('BridgeService', () => {
  let service: BridgeService;
  let model: typeof Bridge;

  const bridgeRepositoryMock: MockType<Repository<Bridge>> = {
    create: jest.fn((bridge) => bridge),
    findOne: jest.fn(() => bridgeDTO),
    findAll: jest.fn(() => bridges),
  };

  const bridge_latencyRepositoryMock: MockType<Repository<Bridge>> = {
    bulkCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BridgeService,
        {
          provide: getModelToken(Bridge),
          useValue: bridgeRepositoryMock,
        },
        {
          provide: getModelToken(BridgeLatency),
          useValue: bridge_latencyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BridgeService>(BridgeService);
    model = module.get<typeof Bridge>(getModelToken(Bridge));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a bridge', async () => {
      expect(await service.create(bridgeDTO)).toEqual(bridgeDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of bridges', async () => {
      const bridges = await service.findAll({
        offset: 0,
        limit: 5,
        filter: {},
        exactMatch: false,
      });
      expect(bridges).toEqual(bridges);
    });
  });

  describe('findOne()', () => {
    it('should get a single bridge', () => {
      expect(service.findOne('1')).toEqual(bridgeDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a bridge', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
