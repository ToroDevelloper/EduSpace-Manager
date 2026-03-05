import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class UpdateReservationDto extends PartialType(
  OmitType(CreateReservationDto, ['teacherId'] as const),
) {
  @IsEnum(ReservationStatus, {
    message: 'El estado debe ser: pendiente, confirmada, cancelada o completada',
  })
  @IsOptional()
  status?: ReservationStatus;
}
