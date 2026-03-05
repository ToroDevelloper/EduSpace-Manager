import { IsInt, IsNotEmpty, IsArray, IsOptional, Min } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  fecha: string;
  
  @IsNotEmpty()
  horaInicio: string;
  
  @IsNotEmpty()
  horaFin: string;
  
  @IsInt()
  @Min(1)
  cantidadPersonas: number;
  
  @IsInt()
  docenteId: number;
  
  @IsInt()
  espacioId: number;
  
  @IsOptional()
  @IsArray()
  recursos?: string[];
}