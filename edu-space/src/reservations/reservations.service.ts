import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { SpacesService } from '../spaces/spaces.service';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly spacesService: SpacesService,
    private readonly resourcesService: ResourcesService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { spaceId, attendeesCount, resourceIds, ...reservationData } = createReservationDto;

    // Validar que el espacio existe y obtener su información
    const space = await this.spacesService.findOne(spaceId);

    // VALIDACIÓN DE CAPACIDAD MÁXIMA (Requisito 5)
    if (attendeesCount > space.maxCapacity) {
      throw new BadRequestException(
        `La cantidad de asistentes (${attendeesCount}) supera la capacidad máxima del espacio "${space.name}" (${space.maxCapacity} personas)`,
      );
    }

    // Validar que no haya conflictos de horario en el mismo espacio
    await this.checkScheduleConflict(
      spaceId,
      createReservationDto.reservationDate,
      createReservationDto.startTime,
      createReservationDto.endTime,
    );

    // Crear la reserva
    const reservation = this.reservationRepository.create({
      ...reservationData,
      spaceId,
      attendeesCount,
    });

    // Asignar recursos adicionales si se proporcionaron
    if (resourceIds && resourceIds.length > 0) {
      const resources = await this.resourcesService.findByIds(resourceIds);
      
      if (resources.length !== resourceIds.length) {
        throw new BadRequestException('Uno o más recursos especificados no existen o no están activos');
      }
      
      reservation.resources = resources;
    }

    return await this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['teacher', 'space', 'space.faculty', 'resources'],
      order: { reservationDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.faculty', 'space', 'space.faculty', 'resources'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reservation;
  }

  // Consulta avanzada: Detalle completo de una reserva (Requisito 6)
  async getFullReservationDetail(id: number) {
    const reservation = await this.findOne(id);

    return {
      id: reservation.id,
      fecha: reservation.reservationDate,
      horaInicio: reservation.startTime,
      horaFin: reservation.endTime,
      cantidadAsistentes: reservation.attendeesCount,
      proposito: reservation.purpose,
      estado: reservation.status,
      notas: reservation.notes,
      docente: {
        id: reservation.teacher?.id,
        nombre: reservation.teacher?.name,
        email: reservation.teacher?.email,
        facultad: reservation.teacher?.faculty?.name,
      },
      espacio: {
        id: reservation.space?.id,
        nombre: reservation.space?.name,
        tipo: reservation.space?.type,
        capacidadMaxima: reservation.space?.maxCapacity,
        ubicacion: reservation.space?.location,
        facultad: reservation.space?.faculty?.name,
      },
      recursosAdicionales: reservation.resources?.map((resource) => ({
        id: resource.id,
        nombre: resource.name,
        categoria: resource.category,
        descripcion: resource.description,
      })) || [],
      fechaCreacion: reservation.createdAt,
      fechaActualizacion: reservation.updatedAt,
    };
  }

  async findByTeacher(teacherId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { teacherId },
      relations: ['space', 'space.faculty', 'resources'],
      order: { reservationDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findBySpace(spaceId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { spaceId },
      relations: ['teacher', 'resources'],
      order: { reservationDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findByDate(date: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { reservationDate: new Date(date) },
      relations: ['teacher', 'space', 'resources'],
      order: { startTime: 'ASC' },
    });
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { status },
      relations: ['teacher', 'space', 'resources'],
      order: { reservationDate: 'DESC', startTime: 'ASC' },
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    const { resourceIds, spaceId, attendeesCount, ...updateData } = updateReservationDto;

    // Si se actualiza el espacio o la cantidad de asistentes, validar capacidad
    if (spaceId || attendeesCount) {
      const targetSpaceId = spaceId || reservation.spaceId;
      const targetAttendees = attendeesCount || reservation.attendeesCount;
      
      const space = await this.spacesService.findOne(targetSpaceId);
      
      if (targetAttendees > space.maxCapacity) {
        throw new BadRequestException(
          `La cantidad de asistentes (${targetAttendees}) supera la capacidad máxima del espacio "${space.name}" (${space.maxCapacity} personas)`,
        );
      }

      // Validar conflictos de horario si se cambia el espacio o las fechas/horas
      if (spaceId || updateReservationDto.reservationDate || updateReservationDto.startTime || updateReservationDto.endTime) {
        await this.checkScheduleConflict(
          targetSpaceId,
          updateReservationDto.reservationDate || reservation.reservationDate.toString(),
          updateReservationDto.startTime || reservation.startTime,
          updateReservationDto.endTime || reservation.endTime,
          id, // Excluir la reserva actual
        );
      }

      reservation.spaceId = targetSpaceId;
      reservation.attendeesCount = targetAttendees;
    }

    // Actualizar recursos si se proporcionaron
    if (resourceIds !== undefined) {
      if (resourceIds.length > 0) {
        const resources = await this.resourcesService.findByIds(resourceIds);
        
        if (resources.length !== resourceIds.length) {
          throw new BadRequestException('Uno o más recursos especificados no existen o no están activos');
        }
        
        reservation.resources = resources;
      } else {
        reservation.resources = [];
      }
    }

    Object.assign(reservation, updateData);
    return await this.reservationRepository.save(reservation);
  }

  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.status = status;
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }

  async cancel(id: number): Promise<Reservation> {
    return await this.updateStatus(id, ReservationStatus.CANCELADA);
  }

  async confirm(id: number): Promise<Reservation> {
    return await this.updateStatus(id, ReservationStatus.CONFIRMADA);
  }

  private async checkScheduleConflict(
    spaceId: number,
    date: string,
    startTime: string,
    endTime: string,
    excludeReservationId?: number,
  ): Promise<void> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.space_id = :spaceId', { spaceId })
      .andWhere('reservation.reservation_date = :date', { date })
      .andWhere('reservation.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [ReservationStatus.CANCELADA],
      })
      .andWhere(
        '(reservation.start_time < :endTime AND reservation.end_time > :startTime)',
        { startTime, endTime },
      );

    if (excludeReservationId) {
      queryBuilder.andWhere('reservation.id != :excludeId', {
        excludeId: excludeReservationId,
      });
    }

    const conflictingReservation = await queryBuilder.getOne();

    if (conflictingReservation) {
      throw new ConflictException(
        `Ya existe una reserva para este espacio en el horario especificado (${conflictingReservation.startTime} - ${conflictingReservation.endTime})`,
      );
    }
  }
}
