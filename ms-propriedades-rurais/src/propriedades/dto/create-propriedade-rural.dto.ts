import { IsString, IsInt, IsNumber, IsNotEmpty, Length, Min } from 'class-validator';

export class CreatePropriedadeRuralDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  idProdutor: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  cidade: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  area_total: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  area_agricultavel: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  area_vegetacao: number;
}