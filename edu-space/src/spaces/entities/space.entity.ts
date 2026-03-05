import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Faculty } from '../../faculties/entities/faculty.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum SpaceType {
  SALON = 'salon',
  LABORATORIO = 'laboratorio',
  AUDITORIO = 'auditorio',
}

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SpaceType,
    default: SpaceType.SALON,
  })
  type: SpaceType;

  @Column({ name: 'max_capacity' })
  maxCapacity: number;

  @Column({ length: 50, nullable: true })
  location: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'faculty_id' })
  facultyId: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.spaces, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @OneToMany(() => Reservation, (reservation) => reservation.space)
  reservations: Reservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
