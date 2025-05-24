import {
  Controller,
  Version,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProdutoresService } from './produtores.service';
import { Produtor } from './entities/produtor.entity';
import { validateDocument } from '../shared/validation.service';
import { UpdateProdutorDto } from './dto/update-produtor.dto';


@Controller('produtores')
export class ProdutoresController {
  constructor(private readonly produtoresService: ProdutoresService) {}

  @Version('1')
  @Get()
  async findAll(): Promise<Produtor[]> {
    return this.produtoresService.findAll();
  }

  @Version('1')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Produtor> {
    try {
      return await this.produtoresService.findOne(+id);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND); // 404
      }
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }
  }


  @Version('1')
  @Post()
  async create(@Body() produtor: Produtor) {
    // Validação do CPF
    if (!validateDocument(produtor.cpf_cnpj).isValid) {
      throw new HttpException('CPF inválido', HttpStatus.BAD_REQUEST); // 400
    }

    try {
      produtor.cpf_cnpj = validateDocument(produtor.cpf_cnpj).formatted;
      return await this.produtoresService.create(produtor);
    } catch (error) {
      if (error.message.includes('já existe')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT); // 409
      }
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }
  }

  @Version('1')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProdutorDto
  ) {
    // Valida o documento se estiver sendo atualizado
    if (updateDto.cpf_cnpj && !validateDocument(updateDto.cpf_cnpj)) {
      throw new HttpException('CPF/CNPJ inválido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.produtoresService.update(id, updateDto);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('já existe')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  
}
