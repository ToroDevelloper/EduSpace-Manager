import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FacultadModule } from './modules/facultad/facultad.module';
import { DocenteModule } from './modules/docente/docente.module';
import { EspacioModule } from './modules/espacio/espacio.module';
import { ReservaModule } from './modules/reserva/reserva.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    FacultadModule,
    DocenteModule,
    EspacioModule,
    ReservaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
