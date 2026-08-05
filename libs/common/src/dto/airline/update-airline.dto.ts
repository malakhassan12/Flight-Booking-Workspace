import { PartialType } from '@nestjs/mapped-types';
import { CreateAirlineDto } from './create-airline.dto';
import { IsUUID } from 'class-validator';

export class UpdateAirlineDto extends PartialType(CreateAirlineDto) {
  @IsUUID()
  id!: string;
}
