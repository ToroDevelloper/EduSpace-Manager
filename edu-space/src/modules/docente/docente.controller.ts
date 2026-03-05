import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe,} from '@nestjs/common';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) { }

  @Post()
  create(@Body() dto: CreateDocenteDto) {
    return this.docenteService.create(dto);
  }

  @Get()
  findAll() {
    return this.docenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.docenteService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocenteDto,
  ) {
    return this.docenteService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.docenteService.delete(id);
  }
}
