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

/**
 * Entidad Teacher (Docente)
 * Esta entidad será completada por el equipo encargado del Requisito Funcional 2
 * Se incluye la estructura básica para las relaciones con Faculty y Reservation
 */
@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 50, nullable: true, name: 'employee_code' })
  employeeCode: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'faculty_id' })
  facultyId: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.teachers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @OneToMany(() => Reservation, (reservation) => reservation.teacher)
  reservations: Reservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
