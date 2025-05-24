import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('produtores')
export class Produtor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 18, unique: true })
  cpf_cnpj: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;
}