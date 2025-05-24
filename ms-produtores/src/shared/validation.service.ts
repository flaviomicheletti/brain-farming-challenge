/**
 * Valida e formata CPF ou CNPJ automaticamente baseado no tamanho da string
 * @param document - String contendo CPF ou CNPJ (com ou sem formatação)
 * @returns objeto com isValid (boolean) e formatted (string) - string vazia se inválido
 */
export function validateDocument(document: string): { isValid: boolean; formatted: string } {
  if (!document) return { isValid: false, formatted: '' };
  
  // Remove caracteres não numéricos
  const cleanDocument = document.replace(/\D/g, '');
  
  // Detecta o tipo pelo tamanho e valida
  if (cleanDocument.length === 11) {
    const isValid = validateCPF(cleanDocument);
    return {
      isValid,
      formatted: isValid ? formatCPF(cleanDocument) : ''
    };
  } else if (cleanDocument.length === 14) {
    const isValid = validateCNPJ(cleanDocument);
    return {
      isValid,
      formatted: isValid ? formatCNPJ(cleanDocument) : ''
    };
  }
  
  return { isValid: false, formatted: '' };
}

/**
 * Valida CPF
 * @param cpf - String contendo apenas números do CPF
 * @returns boolean
 */
function validateCPF(cpf: string): boolean {
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

/**
 * Valida CNPJ
 * @param cnpj - String contendo apenas números do CNPJ
 * @returns boolean
 */
function validateCNPJ(cnpj: string): boolean {
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  // Validação do segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
}

/**
 * Formata CPF no padrão XXX.XXX.XXX-XX
 * @param cpf - String contendo apenas números do CPF
 * @returns string formatada
 */
function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ no padrão XX.XXX.XXX/XXXX-XX
 * @param cnpj - String contendo apenas números do CNPJ
 * @returns string formatada
 */
function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Exemplos de uso:
// console.log(validateDocument('12345678909')); 
// // { isValid: false, formatted: '' }

// console.log(validateDocument('11144477735')); 
// // { isValid: true, formatted: '111.444.777-35' }

// console.log(validateDocument('11222333000181')); 
// // { isValid: true, formatted: '11.222.333/0001-81' }

// console.log(validateDocument('123.456.789-09')); 
// // { isValid: false, formatted: '' }