import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropriedadeRuralController } from './propriedades.controller';
import { PropriedadeRural } from './entities/propriedade-rural.entity';
import { PropriedadeRuralService } from './propriedades.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropriedadeRural])],
  controllers: [PropriedadeRuralController],
  providers: [PropriedadeRuralService],
})
export class PropriedadesRuraisModule {}

