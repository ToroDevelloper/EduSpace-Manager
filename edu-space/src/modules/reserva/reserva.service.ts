import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { RecursoReserva } from './recurso-reserva.entity';
import { Espacio } from '../espacio/espacio.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(RecursoReserva)
    private readonly recursoRepository: Repository<RecursoReserva>,
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
  ) {}

  findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      relations: ['docente', 'docente.facultad', 'espacio', 'recursos'],
    });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['docente', 'docente.facultad', 'espacio', 'recursos'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada`);
    }
    return reserva;
  }

  private async validarCapacidad(espacioId: number, cantidadPersonas: number) {
    const espacio = await this.espacioRepository.findOne({ where: { id: espacioId } });
    if (!espacio) {
      throw new NotFoundException(`Espacio con id ${espacioId} no encontrado`);
    }
    if (cantidadPersonas > espacio.capacidadMaxima) {
      throw new BadRequestException(
        `La cantidad de personas (${cantidadPersonas}) supera la capacidad máxima del espacio (${espacio.capacidadMaxima})`,
      );
    }
    return espacio;
  }

  async create(dto: CreateReservaDto): Promise<Reserva> {
    await this.validarCapacidad(dto.espacioId, dto.cantidadPersonas);

    const reserva = this.reservaRepository.create({
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      cantidadPersonas: dto.cantidadPersonas,
      docenteId: dto.docenteId,
      espacioId: dto.espacioId,
    });

    const savedReserva = await this.reservaRepository.save(reserva);

    if (dto.recursos && dto.recursos.length > 0) {
      const recursos = dto.recursos.map((nombre) =>
        this.recursoRepository.create({ nombre, reservaId: savedReserva.id }),
      );
      await this.recursoRepository.save(recursos);
    }

    return this.findOne(savedReserva.id);
  }

  async update(id: number, dto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    const espacioId = dto.espacioId ?? reserva.espacioId;
    const cantidad = dto.cantidadPersonas ?? reserva.cantidadPersonas;

    await this.validarCapacidad(espacioId, cantidad);

    Object.assign(reserva, {
      fecha: dto.fecha ?? reserva.fecha,
      horaInicio: dto.horaInicio ?? reserva.horaInicio,
      horaFin: dto.horaFin ?? reserva.horaFin,
      cantidadPersonas: cantidad,
      docenteId: dto.docenteId ?? reserva.docenteId,
      espacioId: espacioId,
    });
    await this.reservaRepository.save(reserva);

    if (dto.recursos) {
      await this.recursoRepository.delete({ reservaId: id });
      if (dto.recursos.length > 0) {
        const recursos = dto.recursos.map((nombre) =>
          this.recursoRepository.create({ nombre, reservaId: id }),
        );
        await this.recursoRepository.save(recursos);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
  }
}