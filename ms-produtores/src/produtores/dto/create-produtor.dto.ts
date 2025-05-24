import { IsString, Length } from 'class-validator';

export class CreateProdutorDto {
  @IsString()
  @Length(11, 18) // CPF (11) ou CNPJ (14-18 com formatação)
  cpf_cnpj: string;

  @IsString()
  @Length(1, 100)
  nome: string;
}