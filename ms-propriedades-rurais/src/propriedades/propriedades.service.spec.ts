import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { PropriedadeRuralService } from './propriedades.service';
import { PropriedadeRural } from './entities/propriedade-rural.entity';
import { CreatePropriedadeRuralDto } from './dto/create-propriedade-rural.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('PropriedadeRuralService', () => {
  let service: PropriedadeRuralService;
  let repository: MockRepository<PropriedadeRural>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropriedadeRuralService,
        {
          provide: getRepositoryToken(PropriedadeRural),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<PropriedadeRuralService>(PropriedadeRuralService);
    repository = module.get<MockRepository<PropriedadeRural>>(
      getRepositoryToken(PropriedadeRural),
    );
  });

  describe('findAll', () => {
    it('should return an array of propriedades', async () => {
      const propriedadesArray = [
        {
          id: 1,
          idProdutor: 1,
          nome: 'Fazenda Teste',
          cidade: 'Campinas',
          estado: 'SP',
          area_total: 1000,
          area_agricultavel: 600,
          area_vegetacao: 400,
        },
      ];
      repository.find!.mockResolvedValue(propriedadesArray);

      const result = await service.findAll();
      expect(result).toEqual(propriedadesArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and save a new propriedade', async () => {
      const createDto: CreatePropriedadeRuralDto = {
        idProdutor: 1,
        nome: 'Fazenda Nova',
        cidade: 'Campinas',
        estado: 'SP',
        area_total: 100,
        area_agricultavel: 60,
        area_vegetacao: 40,
      };

      const createdEntity = { id: 1, ...createDto };

      repository.create!.mockReturnValue(createDto);
      repository.save!.mockResolvedValue(createdEntity);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createdEntity);
    });
  });


});
