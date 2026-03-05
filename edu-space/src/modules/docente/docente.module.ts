import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocenteController } from './docente.controller';
import { DocenteService } from './docente.service';
import { Docente } from './docente.entity';
import { Facultad } from '../facultad/facultad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Docente, Facultad])],
  controllers: [DocenteController],
  providers: [DocenteService],
})
export class DocenteModule {}
