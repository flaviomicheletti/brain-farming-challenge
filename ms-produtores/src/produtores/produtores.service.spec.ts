import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ProdutoresService } from './produtores.service';
import { Produtor } from './entities/produtor.entity';
import { UpdateProdutorDto } from './dto/update-produtor.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ProdutoresService', () => {
  let service: ProdutoresService;
  let repository: MockRepository<Produtor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoresService,
        {
          provide: getRepositoryToken(Produtor),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProdutoresService>(ProdutoresService);
    repository = module.get<MockRepository<Produtor>>(getRepositoryToken(Produtor));
  });

  describe('findAll', () => {
    it('should return an array of produtores', async () => {
      const produtoresArray = [{ id: 1 }, { id: 2 }];
      repository.find!.mockResolvedValue(produtoresArray);

      const result = await service.findAll();
      expect(result).toEqual(produtoresArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a produtor if found', async () => {
      const produtor = { id: 1 };
      repository.findOne!.mockResolvedValue(produtor);

      const result = await service.findOne(1);
      expect(result).toEqual(produtor);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw error if produtor not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Produtor não encontrado');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('create', () => {
    it('should create and save a new produtor', async () => {
      const produtorData = { cpf_cnpj: '12345678900', nome: 'Produtor 1' };
      repository.findOne!.mockResolvedValue(null); // não existe ainda
      repository.create!.mockReturnValue(produtorData);
      repository.save!.mockResolvedValue({ id: 1, ...produtorData });

      const result = await service.create(produtorData);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { cpf_cnpj: produtorData.cpf_cnpj } });
      expect(repository.create).toHaveBeenCalledWith(produtorData);
      expect(repository.save).toHaveBeenCalledWith(produtorData);
      expect(result).toEqual({ id: 1, ...produtorData });
    });

    it('should throw error if produtor with cpf_cnpj already exists', async () => {
      const produtorData = { cpf_cnpj: '12345678900' };
      repository.findOne!.mockResolvedValue(produtorData); // já existe

      await expect(service.create(produtorData)).rejects.toThrow('Produtor com este CPF/CNPJ já existe');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { cpf_cnpj: produtorData.cpf_cnpj } });
    });
  });

  describe('update', () => {
    it('should update and save produtor when found and cpf_cnpj not changed', async () => {
      const id = 1;
      const existingProdutor = { id, cpf_cnpj: '12345678900', nome: 'Antigo' };
      const updateDto: UpdateProdutorDto = { nome: 'Novo Nome' };

      repository.findOneBy!.mockResolvedValue(existingProdutor);
      repository.save!.mockResolvedValue({ ...existingProdutor, ...updateDto });

      const result = await service.update(id, updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.save).toHaveBeenCalledWith({ ...existingProdutor, ...updateDto });
      expect(result).toEqual({ ...existingProdutor, ...updateDto });
    });

    it('should update and save produtor when cpf_cnpj changed and new cpf_cnpj does not exist', async () => {
      const id = 1;
      const existingProdutor = { id, cpf_cnpj: '12345678900', nome: 'Antigo' };
      const updateDto: UpdateProdutorDto = { nome: 'Novo Nome', cpf_cnpj: '09876543211' };

      repository.findOneBy!.mockImplementation(({ id: queryId, cpf_cnpj }) => {
        if (queryId) return Promise.resolve(existingProdutor);
        if (cpf_cnpj) return Promise.resolve(null);
        return Promise.resolve(null);
      });

      repository.save!.mockResolvedValue({ id, ...updateDto });

      const result = await service.update(id, updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.findOneBy).toHaveBeenCalledWith({ cpf_cnpj: updateDto.cpf_cnpj });
      expect(repository.save).toHaveBeenCalledWith({ ...existingProdutor, ...updateDto });
      expect(result).toEqual({ id, ...updateDto });
    });

    it('should throw error if produtor not found', async () => {
      repository.findOneBy!.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow('Produtor não encontrado');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should throw error if new cpf_cnpj already exists', async () => {
      const id = 1;
      const existingProdutor = { id, cpf_cnpj: '12345678900' };
      const updateDto: UpdateProdutorDto = { cpf_cnpj: '09876543211' };

      repository.findOneBy!.mockImplementation(({ id: queryId, cpf_cnpj }) => {
        if (queryId) return Promise.resolve(existingProdutor);
        if (cpf_cnpj) return Promise.resolve({ id: 2, cpf_cnpj: '09876543211' }); // já existe outro produtor com este cpf_cnpj
        return Promise.resolve(null);
      });

      await expect(service.update(id, updateDto)).rejects.toThrow('Produtor com este CPF/CNPJ já existe');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.findOneBy).toHaveBeenCalledWith({ cpf_cnpj: updateDto.cpf_cnpj });
    });
  });
});
