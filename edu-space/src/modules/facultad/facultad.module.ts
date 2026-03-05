import { Module } from '@nestjs/common';
import { FacultadController } from './facultad.controller';
import { FacultadService } from './facultad.service';

@Module({
  controllers: [FacultadController],
  providers: [FacultadService]
})
export class FacultadModule {}
