import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoresController } from './produtores.controller';
import { Produtor } from './entities/produtor.entity';
import { ProdutoresService } from './produtores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produtor])],
  controllers: [ProdutoresController],
  providers: [ProdutoresService],
})
export class ProdutoresModule {}

