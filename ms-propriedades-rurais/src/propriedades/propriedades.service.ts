import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropriedadeRural } from './entities/propriedade-rural.entity';
import { CreatePropriedadeRuralDto } from './dto/create-propriedade-rural.dto';

@Injectable()
export class PropriedadeRuralService {
  constructor(
    @InjectRepository(PropriedadeRural)
    private propriedadeRuralRepository: Repository<PropriedadeRural>,
  ) {}

  async findAll(): Promise<PropriedadeRural[]> {
    return this.propriedadeRuralRepository.find();
  }

  async create(createPropriedadeDto: CreatePropriedadeRuralDto): Promise<PropriedadeRural> {
    const novaPropriedade = this.propriedadeRuralRepository.create(createPropriedadeDto);
    return this.propriedadeRuralRepository.save(novaPropriedade);
  }
}