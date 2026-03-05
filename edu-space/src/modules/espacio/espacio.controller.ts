import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EspacioService } from './espacio.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Controller('espacios')
export class EspacioController {
  constructor(private readonly espacioService: EspacioService) {}

  @Get()
  findAll() {
    return this.espacioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.espacioService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEspacioDto) {
    return this.espacioService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspacioDto) {
    return this.espacioService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.espacioService.remove(id);
  }
}
