import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum ResourceCategory {
  AUDIOVISUAL = 'audiovisual',
  INFORMATICO = 'informatico',
  MOBILIARIO = 'mobiliario',
  OTRO = 'otro',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ResourceCategory,
    default: ResourceCategory.OTRO,
  })
  category: ResourceCategory;

  @Column({ name: 'quantity_available', default: 1 })
  quantityAvailable: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => Reservation, (reservation) => reservation.resources)
  reservations: Reservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
