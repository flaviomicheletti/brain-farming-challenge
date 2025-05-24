import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePropriedadeRuralDto } from './create-propriedade-rural.dto';

describe('CreatePropriedadeRuralDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = plainToInstance(CreatePropriedadeRuralDto, {
      idProdutor: 1,
      nome: 'Fazenda Boa Vista',
      cidade: 'Campinas',
      estado: 'SP',
      area_total: 100.5,
      area_agricultavel: 60.25,
      area_vegetacao: 30.25,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if required fields are missing', async () => {
    const dto = plainToInstance(CreatePropriedadeRuralDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    // Pode verificar propriedades específicas:
    const properties = errors.map(e => e.property);
    expect(properties).toEqual(
      expect.arrayContaining([
        'idProdutor',
        'nome',
        'cidade',
        'estado',
        'area_total',
        'area_agricultavel',
        'area_vegetacao',
      ]),
    );
  });

  it('should fail validation if string lengths are invalid', async () => {
    const dto = plainToInstance(CreatePropriedadeRuralDto, {
      idProdutor: 1,
      nome: '', // inválido: length < 1
      cidade: 'C', // inválido: length < 1 (ok, mas vamos testar)
      estado: 'S', // inválido: length != 2
      area_total: 100.5,
      area_agricultavel: 60.25,
      area_vegetacao: 30.25,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toEqual(
      expect.arrayContaining(['nome', 'estado']),
    );
  });

  it('should fail validation if numeric fields are negative or zero', async () => {
    const dto = plainToInstance(CreatePropriedadeRuralDto, {
      idProdutor: 0, // inválido: Min(1)
      nome: 'Fazenda Boa Vista',
      cidade: 'Campinas',
      estado: 'SP',
      area_total: -10, // inválido: Min(0)
      area_agricultavel: -5, // inválido
      area_vegetacao: -1, // inválido
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toEqual(
      expect.arrayContaining(['idProdutor', 'area_total', 'area_agricultavel', 'area_vegetacao']),
    );
  });
});
