import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FacultadService } from './facultad.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Controller('facultad')
export class FacultadController {
  constructor(private readonly facultadService: FacultadService) {}

  @Post()
  create(@Body() dto: CreateFacultadDto) {
    return this.facultadService.create(dto);
  }

  @Get()
  findAll() {
    return this.facultadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facultadService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFacultadDto,
  ) {
    return this.facultadService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultadService.remove(id);
  }
}
