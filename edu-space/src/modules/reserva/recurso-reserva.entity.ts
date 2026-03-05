import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity()
export class RecursoReserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Reserva, (reserva) => reserva.recursos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservaId' })
  reserva: Reserva;

  @Column()
  reservaId: number;
}
