import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProdutorDto } from './create-produtor.dto';

describe('CreateProdutorDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = plainToInstance(CreateProdutorDto, {
      nome: 'João Silva',
      cpf_cnpj: '11144477735', // CPF válido de exemplo
      // Adicione outros campos obrigatórios aqui, se houver
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if cpf_cnpj is missing', async () => {
    const dto = plainToInstance(CreateProdutorDto, {
      nome: 'João Silva',
      // cpf_cnpj ausente
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'cpf_cnpj')).toBe(true);
  });

  it('should fail validation if nome is missing', async () => {
    const dto = plainToInstance(CreateProdutorDto, {
      cpf_cnpj: '11144477735',
      // nome ausente
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'nome')).toBe(true);
  });

  it('should fail validation if cpf_cnpj is invalid format', async () => {
    const dto = plainToInstance(CreateProdutorDto, {
      nome: 'João Silva',
      cpf_cnpj: '123', // inválido
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.property === 'cpf_cnpj')).toBe(true);
  });
});
