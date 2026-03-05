import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Espacio } from '../espacio/espacio.entity';

@Entity()
export class Facultad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Espacio, (espacio) => espacio.facultad)
  espacios: Espacio[];
}
