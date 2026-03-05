import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Espacio } from '../espacio/espacio.entity';
import { Docente } from '../docente/docente.entity';

@Entity()
export class Facultad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Espacio, (espacio) => espacio.facultad)
  espacios: Espacio[];

  // una facultad puede tener muchos docentes
  @OneToMany(() => Docente, (docente) => docente.facultad)
  docentes: Docente[];
}
