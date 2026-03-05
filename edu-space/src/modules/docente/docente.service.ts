import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Docente } from './docente.entity';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Facultad } from '../facultad/facultad.entity';

@Injectable()
export class DocenteService {
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepo: Repository<Docente>,
    @InjectRepository(Facultad)
    private readonly facultadRepo: Repository<Facultad>,
  ) {}

  async create(dto: CreateDocenteDto): Promise<Docente> {
    const facultad = await this.facultadRepo.findOne({
      where: { id: dto.facultadId },
    });
    if (!facultad) {
      throw new NotFoundException('Facultad not found');
    }
    const docente = this.docenteRepo.create({
      nombre: dto.nombre,
      email: dto.email,
      facultad,
    });
    return this.docenteRepo.save(docente);
  }

  findAll(): Promise<Docente[]> {
    return this.docenteRepo.find({ relations: ['facultad'] });
  }

  async findOne(id: number): Promise<Docente> {
    const docente = await this.docenteRepo.findOne({
      where: { id },
      relations: ['facultad'],
    });
    if (!docente) {
      throw new NotFoundException('Docente not found');
    }
    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto): Promise<Docente> {
    const docente = await this.findOne(id);
    if (dto.facultadId) {
      const facultad = await this.facultadRepo.findOne({
        where: { id: dto.facultadId },
      });
      if (!facultad) {
        throw new NotFoundException('Facultad not found');
      }
      docente.facultad = facultad;
    }
    Object.assign(docente, dto);
    return this.docenteRepo.save(docente);
  }

  async remove(id: number): Promise<void> {
    const docente = await this.findOne(id);
    await this.docenteRepo.remove(docente);
  }
}
