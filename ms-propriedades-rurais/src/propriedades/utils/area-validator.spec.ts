import { BadRequestException } from '@nestjs/common';
import { validateAreas } from './area-validator';
import { CreatePropriedadeRuralDto } from '../dto/create-propriedade-rural.dto';

describe('validateAreas', () => {
  it('should not throw if sum of areas is less than or equal to total', () => {
    const dto: CreatePropriedadeRuralDto = {
      idProdutor: 1,
      nome: 'Fazenda Teste',
      cidade: 'Campinas',
      estado: 'SP',
      area_total: 100,
      area_agricultavel: 60,
      area_vegetacao: 40,
    };

    expect(() => validateAreas(dto)).not.toThrow();
  });

  it('should throw BadRequestException if sum of areas exceeds total', () => {
    const dto: CreatePropriedadeRuralDto = {
      idProdutor: 1,
      nome: 'Fazenda Teste',
      cidade: 'Campinas',
      estado: 'SP',
      area_total: 100,
      area_agricultavel: 70,
      area_vegetacao: 40,
    };

    expect(() => validateAreas(dto)).toThrow(BadRequestException);
    expect(() => validateAreas(dto)).toThrow('A soma da área agricultável e de vegetação não pode exceder a área total');
  });
});
