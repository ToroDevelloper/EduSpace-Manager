import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { RecursoReserva } from './recurso-reserva.entity';
import { Espacio } from '../espacio/espacio.entity';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, RecursoReserva, Espacio])],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
