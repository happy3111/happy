// src/server/server.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { serverDTO, servers } from './dto/server.dto';
import { ServerResolver } from './server.resolver';
import { ServerService } from './server.service';

describe('ServerResolver', () => {
  let resolver: ServerResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerResolver,
        {
          provide: ServerService,
          useFactory: () => ({
            create: jest.fn((server) => ({
              id: '1',
              ...server,
            })),
            findAll: jest.fn(() => servers),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...serverDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<ServerResolver>(ServerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('server', () => {
    it('should find and return a server', async () => {
      const server = await resolver.server('1');
      expect(server).toEqual({
        id: '1',
        ...serverDTO,
      });
    });
  });
  describe('servers', () => {
    it('should find and return a list of servers', async () => {
      const servers = await resolver.servers({
        limit: 25,
        offset: 0,
        filter: {},
        exactMatch: false,
      });
      expect(servers).toEqual(servers);
    });
  });
  describe('createServer', () => {
    it('should find and return a server', async () => {
      const server = await resolver.addServer(serverDTO);
      expect(server).toEqual({
        id: '1',
        ...serverDTO,
      });
    });
  });
});
