import { Test, TestingModule } from '@nestjs/testing';
import { Server } from './server.entity';
import { ServerService } from './server.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { serverDTO, servers } from './dto/server.dto';
import { MockType } from 'test/mocktype';

describe('ServerService', () => {
  let service: ServerService;
  let model: typeof Server;

  const serverRepositoryMock: MockType<Repository<Server>> = {
    create: jest.fn((server) => server),
    findOne: jest.fn(() => serverDTO),
    findAll: jest.fn(() => servers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerService,
        {
          provide: getModelToken(Server),
          useValue: serverRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ServerService>(ServerService);
    model = module.get<typeof Server>(getModelToken(Server));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a server', async () => {
      expect(await service.create(serverDTO)).toEqual(serverDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of servers', async () => {
      const servers = await service.findAll({
        offset: 0,
        limit: 5,
        filter: {},
        exactMatch: false,
      });
      expect(servers).toEqual(servers);
    });
  });

  describe('findOne()', () => {
    it('should get a single server', () => {
      expect(service.findOne('1')).toEqual(serverDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a server', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
