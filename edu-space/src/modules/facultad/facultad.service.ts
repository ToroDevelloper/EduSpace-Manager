import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facultad } from './facultad.entity';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Injectable()
export class FacultadService {
  constructor(
    @InjectRepository(Facultad)
    private readonly facultadRepo: Repository<Facultad>,
  ) {}

  create(dto: CreateFacultadDto): Promise<Facultad> {
    const fac = this.facultadRepo.create(dto);
    return this.facultadRepo.save(fac);
  }

  findAll(): Promise<Facultad[]> {
    return this.facultadRepo.find({ relations: ['espacios', 'docentes'] });
  }

  async findOne(id: number): Promise<Facultad> {
    const fac = await this.facultadRepo.findOne({
      where: { id },
      relations: ['espacios', 'docentes'],
    });
    if (!fac) {
      throw new NotFoundException('Facultad not found');
    }
    return fac;
  }

  async update(id: number, dto: UpdateFacultadDto): Promise<Facultad> {
    const fac = await this.findOne(id);
    Object.assign(fac, dto);
    return this.facultadRepo.save(fac);
  }

  async remove(id: number): Promise<void> {
    const fac = await this.findOne(id);
    await this.facultadRepo.remove(fac);
  }
}
