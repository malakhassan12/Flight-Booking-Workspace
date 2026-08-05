import { PartialType } from '@nestjs/mapped-types';
import { CreateAirportDto } from './create-airport.dto';
import { IsUUID } from 'class-validator';

export class UpdateAirportDto extends PartialType(CreateAirportDto) {
  @IsUUID()
  id!: string;
}
