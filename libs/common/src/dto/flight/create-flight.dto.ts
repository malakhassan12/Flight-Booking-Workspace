import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { FlightStatus } from '../../types/enum/flight-status.enum';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightNumber!: string;

  @IsUUID()
  airlineId!: string;

  @IsUUID()
  aircraftId!: string;

  @IsUUID()
  originAirportId!: string;

  @IsUUID()
  destinationAirportId!: string;

  @IsDateString()
  departureTime!: string;

  @IsDateString()
  arrivalTime!: string;

  @IsEnum(FlightStatus)
  status!: FlightStatus;
}
