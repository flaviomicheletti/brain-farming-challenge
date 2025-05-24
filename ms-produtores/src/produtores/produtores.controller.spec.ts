import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoresController } from './produtores.controller';
import { ProdutoresService } from './produtores.service';
import { HttpException } from '@nestjs/common';
import { validateDocument } from '../shared/validation.service';

jest.mock('../shared/validation.service', () => ({
  validateDocument: jest.fn(),
}));

describe('ProdutoresController', () => {
  let controller: ProdutoresController;
  let service: ProdutoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoresController],
      providers: [
        {
          provide: ProdutoresService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutoresController>(ProdutoresController);
    service = module.get<ProdutoresService>(ProdutoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of produtores', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a produtor', async () => {
      const produtor = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(produtor as any);
      expect(await controller.findOne('1')).toBe(produtor);
    });

    it('should throw 404 if not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('não encontrado'));
      await expect(controller.findOne('99')).rejects.toThrow(HttpException);
    });

    it('should throw 500 on other errors', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('erro desconhecido'));
      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a produtor when CPF is valid', async () => {
      const produtor = { cpf_cnpj: '123', nome: 'Teste' };
      (validateDocument as jest.Mock).mockReturnValue({ isValid: true, formatted: '123' });
      jest.spyOn(service, 'create').mockResolvedValue({ id: 1, ...produtor });
      expect(await controller.create(produtor as any)).toEqual({ id: 1, ...produtor });
    });

    it('should throw 400 when CPF is invalid', async () => {
      const produtor = { cpf_cnpj: '123', nome: 'Teste' };
      (validateDocument as jest.Mock).mockReturnValue({ isValid: false });
      await expect(controller.create(produtor as any)).rejects.toThrow(HttpException);
    });

    it('should throw 409 if produtor already exists', async () => {
      const produtor = { cpf_cnpj: '123', nome: 'Teste' };
      (validateDocument as jest.Mock).mockReturnValue({ isValid: true, formatted: '123' });
      jest.spyOn(service, 'create').mockRejectedValue(new Error('já existe'));
      await expect(controller.create(produtor as any)).rejects.toThrow(HttpException);
    });

    it('should throw 500 on other errors', async () => {
      const produtor = { cpf_cnpj: '123', nome: 'Teste' };
      (validateDocument as jest.Mock).mockReturnValue({ isValid: true, formatted: '123' });
      jest.spyOn(service, 'create').mockRejectedValue(new Error('erro desconhecido'));
      await expect(controller.create(produtor as any)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a produtor', async () => {
      const updateDto = { nome: 'Novo Nome' };
      jest.spyOn(service, 'update').mockResolvedValue({ id: 1, cpf_cnpj: '12345678900', ...updateDto });
      expect(await controller.update(1, updateDto as any)).toEqual({ id: 1, cpf_cnpj: '12345678900', ...updateDto });
    });

    it('should validate cpf_cnpj if provided', async () => {
      const updateDto = { cpf_cnpj: '123' };
      (validateDocument as jest.Mock).mockReturnValue(false);
      await expect(controller.update(1, updateDto as any)).rejects.toThrow(HttpException);
    });

    it('should throw 404 if not found', async () => {
      const updateDto = {};
      jest.spyOn(service, 'update').mockRejectedValue(new Error('não encontrado'));
      await expect(controller.update(1, updateDto as any)).rejects.toThrow(HttpException);
    });

    it('should throw 409 if produtor already exists', async () => {
      const updateDto = {};
      jest.spyOn(service, 'update').mockRejectedValue(new Error('já existe'));
      await expect(controller.update(1, updateDto as any)).rejects.toThrow(HttpException);
    });

    it('should throw 500 on other errors', async () => {
      const updateDto = {};
      jest.spyOn(service, 'update').mockRejectedValue(new Error('erro desconhecido'));
      await expect(controller.update(1, updateDto as any)).rejects.toThrow(HttpException);
    });
  });
});
