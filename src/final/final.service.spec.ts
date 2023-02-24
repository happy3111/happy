import { Test, TestingModule } from '@nestjs/testing';
import { Final } from './final.entity';
import { FinalService } from './final.service';
import { getModelToken } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { finalDTO, finals } from './dto/final.dto';
import { MockType } from 'test/mocktype';

describe('FinalService', () => {
  let service: FinalService;
  let model: typeof Final;

  const finalRepositoryMock: MockType<Repository<Final>> = {
    create: jest.fn((final) => final),
    findOne: jest.fn(() => finalDTO),
    findAll: jest.fn(() => finals),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinalService,
        {
          provide: getModelToken(Final),
          useValue: finalRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FinalService>(FinalService);
    model = module.get<typeof Final>(getModelToken(Final));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a final', async () => {
      expect(await service.create(finalDTO)).toEqual(finalDTO);
    });
  });

  describe('findAll()', () => {
    it('should return an array of finals', async () => {
      const finals = await service.findAll({
        offset: 0,
        limit: 5,
        filter: {},
        exactMatch: false,
      });
      expect(finals).toEqual(finals);
    });
  });

  describe('findOne()', () => {
    it('should get a single final', () => {
      expect(service.findOne('1')).toEqual(finalDTO);
    });
  });

  describe('remove()', () => {
    it('should remove a final', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('2');
      expect(retVal).toEqual(true);
    });
  });
});
