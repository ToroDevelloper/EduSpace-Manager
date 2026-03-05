import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from './espacio.entity';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Injectable()
export class EspacioService {
  constructor(
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
  ) {}

  findAll(): Promise<Espacio[]> {
    return this.espacioRepository.find({ relations: ['facultad'] });
  }

  async findOne(id: number): Promise<Espacio> {
    const espacio = await this.espacioRepository.findOne({
      where: { id },
      relations: ['facultad'],
    });
    if (!espacio) {
      throw new NotFoundException(`Espacio con id ${id} no encontrado`);
    }
    return espacio;
  }

  create(dto: CreateEspacioDto): Promise<Espacio> {
    const espacio = this.espacioRepository.create(dto);
    return this.espacioRepository.save(espacio);
  }

  async update(id: number, dto: UpdateEspacioDto): Promise<Espacio> {
    const espacio = await this.findOne(id);
    Object.assign(espacio, dto);
    return this.espacioRepository.save(espacio);
  }

  async remove(id: number): Promise<void> {
    const espacio = await this.findOne(id);
    await this.espacioRepository.remove(espacio);
  }
}
