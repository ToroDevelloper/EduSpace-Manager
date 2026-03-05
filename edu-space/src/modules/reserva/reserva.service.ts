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

  async create(dto: CreateReservaDto): Promise<Reserva> {
    // Validar capacidad máxima del espacio
    const espacio = await this.espacioRepository.findOne({ where: { id: dto.espacioId } });
    if (!espacio) {
      throw new NotFoundException(`Espacio con id ${dto.espacioId} no encontrado`);
    }
    if (dto.cantidadPersonas > espacio.capacidadMaxima) {
      throw new BadRequestException(
        `La cantidad de personas (${dto.cantidadPersonas}) supera la capacidad máxima del espacio (${espacio.capacidadMaxima})`,
      );
    }

    const reserva = this.reservaRepository.create({
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      cantidadPersonas: dto.cantidadPersonas,
      docenteId: dto.docenteId,
      espacioId: dto.espacioId,
    });

    const savedReserva = await this.reservaRepository.save(reserva);

    // Crear recursos adicionales si se enviaron
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

    // Si cambia espacioId o cantidadPersonas, validar capacidad
    const espacioId = dto.espacioId ?? reserva.espacioId;
    const cantidad = dto.cantidadPersonas ?? reserva.cantidadPersonas;

    const espacio = await this.espacioRepository.findOne({ where: { id: espacioId } });
    if (!espacio) {
      throw new NotFoundException(`Espacio con id ${espacioId} no encontrado`);
    }
    if (cantidad > espacio.capacidadMaxima) {
      throw new BadRequestException(
        `La cantidad de personas (${cantidad}) supera la capacidad máxima del espacio (${espacio.capacidadMaxima})`,
      );
    }

    // Actualizar campos básicos
    Object.assign(reserva, {
      fecha: dto.fecha ?? reserva.fecha,
      horaInicio: dto.horaInicio ?? reserva.horaInicio,
      horaFin: dto.horaFin ?? reserva.horaFin,
      cantidadPersonas: cantidad,
      docenteId: dto.docenteId ?? reserva.docenteId,
      espacioId: espacioId,
    });
    await this.reservaRepository.save(reserva);

    // Si se envían recursos, reemplazar los existentes
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
