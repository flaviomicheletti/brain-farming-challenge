import { BadRequestException } from '@nestjs/common';
import { CreatePropriedadeRuralDto } from '../dto/create-propriedade-rural.dto';

export function validateAreas(createPropriedadeDto: CreatePropriedadeRuralDto): void {
  if (createPropriedadeDto.area_agricultavel + createPropriedadeDto.area_vegetacao > createPropriedadeDto.area_total) {
    throw new BadRequestException('A soma da área agricultável e de vegetação não pode exceder a área total');
  }
}