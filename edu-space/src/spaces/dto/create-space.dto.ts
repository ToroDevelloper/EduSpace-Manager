import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { SpaceType } from '../entities/space.entity';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del espacio es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SpaceType, {
    message: 'El tipo debe ser: salon, laboratorio o auditorio',
  })
  type: SpaceType;

  @IsNumber()
  @IsPositive({ message: 'La capacidad máxima debe ser un número positivo' })
  @Min(1, { message: 'La capacidad mínima debe ser 1' })
  maxCapacity: number;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La ubicación no puede exceder 50 caracteres' })
  location?: string;

  @IsNumber()
  @IsPositive({ message: 'El ID de facultad debe ser un número positivo' })
  facultyId: number;
}
