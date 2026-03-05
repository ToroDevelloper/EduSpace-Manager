import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
