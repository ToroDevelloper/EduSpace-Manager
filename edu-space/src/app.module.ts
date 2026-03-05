import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacultadModule } from './modules/facultad/facultad.module';
import { DocenteModule } from './modules/docente/docente.module';

@Module({
  imports: [FacultadModule, DocenteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
