export class CreateReservaDto {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
  docenteId: number;
  espacioId: number;
  recursos?: string[];
}
