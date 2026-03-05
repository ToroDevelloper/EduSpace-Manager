import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsArray,
  IsDateString,
  Matches,
  Min,
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateReservationDto {
  @IsDateString({}, { message: 'La fecha de reserva debe ser una fecha válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fecha de reserva es requerida' })
  reservationDate: string;

  @IsString()
  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:MM',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:MM',
  })
  endTime: string;

  @IsNumber()
  @IsPositive({ message: 'El número de asistentes debe ser positivo' })
  @Min(1, { message: 'Debe haber al menos 1 asistente' })
  attendeesCount: number;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsPositive({ message: 'El ID del docente debe ser un número positivo' })
  teacherId: number;

  @IsNumber()
  @IsPositive({ message: 'El ID del espacio debe ser un número positivo' })
  spaceId: number;

  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada ID de recurso debe ser un número' })
  @IsOptional()
  resourceIds?: number[];
}
