import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produtor } from './entities/produtor.entity';
import { UpdateProdutorDto } from './dto/update-produtor.dto';

@Injectable()
export class ProdutoresService {
  constructor(
    @InjectRepository(Produtor)
    private produtoresRepository: Repository<Produtor>,
  ) {}

  async findAll(): Promise<Produtor[]> {
    return this.produtoresRepository.find();
  }

  async findOne(id: number): Promise<Produtor> {
    const produtor = await this.produtoresRepository.findOne({ where: { id } });

    if (!produtor) {
      throw new Error('Produtor não encontrado');
    }

    return produtor;
  }

  async create(produtor: Partial<Produtor>): Promise<Produtor> {
    // Verifica se CPF/CNPJ já existe
    const exists = await this.produtoresRepository.findOne({
      where: { cpf_cnpj: produtor.cpf_cnpj },
    });

    if (exists) {
      throw new Error('Produtor com este CPF/CNPJ já existe');
    }

    const novoProdutor = this.produtoresRepository.create(produtor);
    return this.produtoresRepository.save(novoProdutor);
  }

  async update(id: number, updateDto: UpdateProdutorDto): Promise<Produtor> {
    const produtor = await this.produtoresRepository.findOneBy({ id });

    if (!produtor) {
      throw new Error('Produtor não encontrado');
    }

    // Verifica se o novo CPF/CNPJ já existe
    if (updateDto.cpf_cnpj && updateDto.cpf_cnpj !== produtor.cpf_cnpj) {
      const exists = await this.produtoresRepository.findOneBy({
        cpf_cnpj: updateDto.cpf_cnpj,
      });

      if (exists) {
        throw new Error('Produtor com este CPF/CNPJ já existe');
      }
    }

    // Atualiza apenas os campos fornecidos
    Object.assign(produtor, updateDto);
    return this.produtoresRepository.save(produtor);
  }
}
