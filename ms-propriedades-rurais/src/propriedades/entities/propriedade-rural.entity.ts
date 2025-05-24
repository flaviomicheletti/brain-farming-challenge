import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('propriedades_rurais')
export class PropriedadeRural {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_produtor', type: 'int' })
  idProdutor: number; // Apenas armazena o ID, sem relação TypeORM

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 50 })
  cidade: string;

  @Column({ type: 'char', length: 2 })
  estado: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  area_total: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  area_agricultavel: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  area_vegetacao: number;
}