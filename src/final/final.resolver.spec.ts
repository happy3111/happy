// src/final/final.resolver.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { finalDTO, finals } from './dto/final.dto';
import { FinalResolver } from './final.resolver';
import { FinalService } from './final.service';

describe('FinalResolver', () => {
  let resolver: FinalResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinalResolver,
        {
          provide: FinalService,
          useFactory: () => ({
            create: jest.fn((final) => ({
              id: '1',
              ...final,
            })),
            findAll: jest.fn(() => finals),
            findOne: jest.fn((id: string) => ({
              id: id,
              ...finalDTO,
            })),
          }),
        },
      ],
    }).compile();
    resolver = module.get<FinalResolver>(FinalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('final', () => {
    it('should find and return a final', async () => {
      const final = await resolver.final('1');
      expect(final).toEqual({
        id: '1',
        ...finalDTO,
      });
    });
  });
  describe('finals', () => {
    it('should find and return a list of finals', async () => {
      const finals = await resolver.finals({
        limit: 25,
        offset: 0,
        filter: {},
        exactMatch: false,
      });
      expect(finals).toEqual(finals);
    });
  });
  describe('createFinal', () => {
    it('should find and return a final', async () => {
      const final = await resolver.addFinal(finalDTO);
      expect(final).toEqual({
        id: '1',
        ...finalDTO,
      });
    });
  });
});
