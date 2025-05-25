import { Controller, Get, Version, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { PropriedadeRuralService } from './propriedades.service';
import { PropriedadeRural } from './entities/propriedade-rural.entity';
import { CreatePropriedadeRuralDto } from './dto/create-propriedade-rural.dto';
import { validateAreas } from './utils/area-validator';

@Controller('propriedades')
export class PropriedadeRuralController {
  constructor(private readonly propriedadeRuralService: PropriedadeRuralService) {}

  private readonly logger = new Logger(PropriedadeRuralController.name);  

  @Version('1')
  @Get()
  async findAll(): Promise<PropriedadeRural[]> {
    this.logger.log('exemplo de log');    
    return this.propriedadeRuralService.findAll();
  }

  @Version('1')
  @Post()
  async create(@Body(ValidationPipe) createPropriedadeDto: CreatePropriedadeRuralDto): Promise<PropriedadeRural> {
    validateAreas(createPropriedadeDto);
    return this.propriedadeRuralService.create(createPropriedadeDto);
  }
}