// src/produtores/dto/update-produtor.dto.ts
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProdutorDto {
  @IsOptional()
  @IsString()
  @Length(11, 18) // Apenas valida o tamanho, não o formato
  cpf_cnpj?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  nome?: string;
}