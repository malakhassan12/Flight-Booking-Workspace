import { IsUUID } from 'class-validator';

export class CreateFlightSeatsDto {
  @IsUUID()
  flightId!: string;

  @IsUUID()
  aircraftModelId!: string;
}
