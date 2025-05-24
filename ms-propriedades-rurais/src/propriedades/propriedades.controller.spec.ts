import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadeRuralController } from './propriedades.controller';
import { PropriedadeRuralService } from './propriedades.service';
import { CreatePropriedadeRuralDto } from './dto/create-propriedade-rural.dto';
import * as areaValidator from './utils/area-validator';

describe('PropriedadeRuralController', () => {
  let controller: PropriedadeRuralController;
  let service: PropriedadeRuralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropriedadeRuralController],
      providers: [
        {
          provide: PropriedadeRuralService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest
              .fn()
              .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
          },
        },
      ],
    }).compile();

    controller = module.get<PropriedadeRuralController>(
      PropriedadeRuralController,
    );
    service = module.get<PropriedadeRuralService>(PropriedadeRuralService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of propriedades', async () => {
      const result = [
        {
          id:1,
          idProdutor: 1,
          nome: 'Fazenda Teste',
          cidade: 'Campinas',
          estado: 'SP',
          area_total: 1000,
          area_agricultavel: 600,
          area_vegetacao: 400,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const validDto: CreatePropriedadeRuralDto = {
      idProdutor: 1,
      nome: 'Fazenda Boa Vista',
      cidade: 'Campinas',
      estado: 'SP',
      area_total: 100.5,
      area_agricultavel: 60.25,
      area_vegetacao: 30.25,
    };

    it('should call validateAreas and create a propriedade', async () => {
      const validateAreasSpy = jest
        .spyOn(areaValidator, 'validateAreas')
        .mockImplementation(() => {});
      jest.spyOn(service, 'create').mockResolvedValue({ id: 1, ...validDto });

      const result = await controller.create(validDto);

      expect(validateAreasSpy).toHaveBeenCalledWith(validDto);
      expect(service.create).toHaveBeenCalledWith(validDto);
      expect(result).toEqual({ id: 1, ...validDto });

      validateAreasSpy.mockRestore();
    });
  });
});
