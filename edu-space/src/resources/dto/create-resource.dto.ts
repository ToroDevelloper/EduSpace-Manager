import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ResourceCategory } from '../entities/resource.entity';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del recurso es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ResourceCategory, {
    message: 'La categoría debe ser: audiovisual, informatico, mobiliario u otro',
  })
  @IsOptional()
  category?: ResourceCategory;

  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @IsOptional()
  quantityAvailable?: number;
}
