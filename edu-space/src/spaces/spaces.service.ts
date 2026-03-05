import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './entities/space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
    const space = this.spaceRepository.create(createSpaceDto);
    return await this.spaceRepository.save(space);
  }

  async findAll(): Promise<Space[]> {
    return await this.spaceRepository.find({
      relations: ['faculty'],
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Space> {
    const space = await this.spaceRepository.findOne({
      where: { id },
      relations: ['faculty'],
    });

    if (!space) {
      throw new NotFoundException(`Espacio con ID ${id} no encontrado`);
    }

    return space;
  }

  async findByFaculty(facultyId: number): Promise<Space[]> {
    return await this.spaceRepository.find({
      where: { facultyId, isActive: true },
      relations: ['faculty'],
    });
  }

  async findByType(type: string): Promise<Space[]> {
    return await this.spaceRepository.find({
      where: { type: type as any, isActive: true },
      relations: ['faculty'],
    });
  }

  async findAvailableSpaces(minCapacity: number): Promise<Space[]> {
    return await this.spaceRepository
      .createQueryBuilder('space')
      .leftJoinAndSelect('space.faculty', 'faculty')
      .where('space.isActive = :isActive', { isActive: true })
      .andWhere('space.maxCapacity >= :minCapacity', { minCapacity })
      .orderBy('space.maxCapacity', 'ASC')
      .getMany();
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
    const space = await this.findOne(id);

    if (updateSpaceDto.maxCapacity && updateSpaceDto.maxCapacity < 1) {
      throw new BadRequestException('La capacidad máxima debe ser al menos 1');
    }

    Object.assign(space, updateSpaceDto);
    return await this.spaceRepository.save(space);
  }

  async remove(id: number): Promise<void> {
    const space = await this.findOne(id);
    await this.spaceRepository.remove(space);
  }

  async deactivate(id: number): Promise<Space> {
    const space = await this.findOne(id);
    space.isActive = false;
    return await this.spaceRepository.save(space);
  }

  async checkCapacity(spaceId: number, requiredCapacity: number): Promise<boolean> {
    const space = await this.findOne(spaceId);
    return space.maxCapacity >= requiredCapacity;
  }
}
