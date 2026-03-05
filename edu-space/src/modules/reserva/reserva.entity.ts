import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Docente } from '../docente/docente.entity';
import { Espacio } from '../espacio/espacio.entity';
import { RecursoReserva } from './recurso-reserva.entity';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  cantidadPersonas: number;

  @ManyToOne(() => Docente)
  @JoinColumn({ name: 'docenteId' })
  docente: Docente;

  @Column()
  docenteId: number;

  @ManyToOne(() => Espacio)
  @JoinColumn({ name: 'espacioId' })
  espacio: Espacio;

  @Column()
  espacioId: number;

  @OneToMany(() => RecursoReserva, (recurso) => recurso.reserva, { cascade: true })
  recursos: RecursoReserva[];
}
