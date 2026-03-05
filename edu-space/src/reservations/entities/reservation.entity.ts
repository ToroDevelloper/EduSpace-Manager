import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Space } from '../../spaces/entities/space.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum ReservationStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'reservation_date' })
  reservationDate: Date;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ name: 'attendees_count' })
  attendeesCount: number;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDIENTE,
  })
  status: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ name: 'space_id' })
  spaceId: number;

  @ManyToOne(() => Space, (space) => space.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id' })
  space: Space;

  @ManyToMany(() => Resource, (resource) => resource.reservations)
  @JoinTable({
    name: 'reservation_resources',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'resource_id',
      referencedColumnName: 'id',
    },
  })
  resources: Resource[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
