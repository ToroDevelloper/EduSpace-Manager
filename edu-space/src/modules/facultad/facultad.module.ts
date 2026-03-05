import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultad } from './facultad.entity';
import { FacultadController } from './facultad.controller';
import { FacultadService } from './facultad.service';

@Module({
  imports: [TypeOrmModule.forFeature([Facultad])],
  controllers: [FacultadController],
  providers: [FacultadService]
})
export class FacultadModule {}
