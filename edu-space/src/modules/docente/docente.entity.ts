import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Facultad } from '../facultad/facultad.entity';

@Entity()
export class Docente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  email?: string;

  // Relación a la facultad a la que pertenece
  @ManyToOne(() => Facultad, (facultad) => facultad.docentes, { nullable: false })
  facultad: Facultad;
}
