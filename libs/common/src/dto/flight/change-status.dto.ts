import { IsEnum, IsUUID } from 'class-validator';
import { FlightStatus } from '../../types/enum/flight-status.enum';

export class ChangeStatusDto {
  @IsUUID()
  flightId!: string;

  @IsEnum(FlightStatus)
  status!: FlightStatus;
}
