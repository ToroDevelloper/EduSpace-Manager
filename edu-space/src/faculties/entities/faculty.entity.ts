import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Space } from '../../spaces/entities/space.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

/**
 * Entidad Faculty (Facultad)
 * Esta entidad será completada por el equipo encargado del Requisito Funcional 1
 * Se incluye la estructura básica para las relaciones con Space y Teacher
 */
@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Space, (space) => space.faculty)
  spaces: Space[];

  @OneToMany(() => Teacher, (teacher) => teacher.faculty)
  teachers: Teacher[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
