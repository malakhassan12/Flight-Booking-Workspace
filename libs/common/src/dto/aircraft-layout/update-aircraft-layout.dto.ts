import { PartialType } from '@nestjs/mapped-types';
import { CreateAircraftLayoutDto } from './create-aircraft-layout.dto';
import { IsUUID } from 'class-validator';

export class UpdateAircarftLayoutDto extends PartialType(
  CreateAircraftLayoutDto,
) {
  @IsUUID()
  id!: string;
}
