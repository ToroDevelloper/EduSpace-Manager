import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Facultad } from '../facultad/facultad.entity';

@Entity()
export class Espacio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  capacidadMaxima: number;

  @ManyToOne(() => Facultad, (facultad) => facultad.espacios)
  @JoinColumn({ name: 'facultadId' })
  facultad: Facultad;

  @Column()
  facultadId: number;
}
