import { validateDocument } from './validation.service';

describe('validateDocument', () => {
  // CPFs válidos (sem e com formatação)
  const validCpfs = [
    { input: '11144477735', formatted: '111.444.777-35' },
    { input: '111.444.777-35', formatted: '111.444.777-35' },
    { input: '52998224725', formatted: '529.982.247-25' },
    { input: '529.982.247-25', formatted: '529.982.247-25' },
  ];

  // CPFs inválidos
  const invalidCpfs = [
    '11111111111',
    '22222222222',
    '12345678900',
    '00000000000',
    'abc.def.ghi-jk',
    '',
    null as unknown as string,
    undefined as unknown as string,
  ];

  // CNPJs válidos (sem e com formatação)
  const validCnpjs = [
    { input: '11222333000181', formatted: '11.222.333/0001-81' },
    { input: '11.222.333/0001-81', formatted: '11.222.333/0001-81' },
    { input: '19131243000197', formatted: '19.131.243/0001-97' },
    { input: '19.131.243/0001-97', formatted: '19.131.243/0001-97' },
  ];

  // CNPJs inválidos
  const invalidCnpjs = [
    '11111111111111',
    '22222222222222',
    '12345678000100',
    '00000000000000',
    'abcdefghijklmno',
    '',
    null as unknown as string,
    undefined as unknown as string,
  ];

  it('should return isValid false and empty formatted for empty or falsy input', () => {
    expect(validateDocument('')).toEqual({ isValid: false, formatted: '' });
    expect(validateDocument(null as unknown as string)).toEqual({
      isValid: false,
      formatted: '',
    });
    expect(validateDocument(undefined as unknown as string)).toEqual({
      isValid: false,
      formatted: '',
    });
  });

  describe('CPF validation', () => {
    validCpfs.forEach(({ input, formatted }) => {
      it(`should validate and format valid CPF: ${input}`, () => {
        const result = validateDocument(input);
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe(formatted);
      });
    });

    invalidCpfs.forEach((cpf) => {
      it(`should invalidate invalid CPF: ${cpf}`, () => {
        const result = validateDocument(cpf);
        expect(result.isValid).toBe(false);
        expect(result.formatted).toBe('');
      });
    });
  });

  describe('CNPJ validation', () => {
    validCnpjs.forEach(({ input, formatted }) => {
      it(`should validate and format valid CNPJ: ${input}`, () => {
        const result = validateDocument(input);
        expect(result.isValid).toBe(true);
        expect(result.formatted).toBe(formatted);
      });
    });

    invalidCnpjs.forEach((cnpj) => {
      it(`should invalidate invalid CNPJ: ${cnpj}`, () => {
        const result = validateDocument(cnpj);
        expect(result.isValid).toBe(false);
        expect(result.formatted).toBe('');
      });
    });
  });

  it('should invalidate documents with invalid length', () => {
    expect(validateDocument('123')).toEqual({ isValid: false, formatted: '' });
    expect(validateDocument('123456789012')).toEqual({
      isValid: false,
      formatted: '',
    });
    expect(validateDocument('123456789012345')).toEqual({
      isValid: false,
      formatted: '',
    });
  });
});
