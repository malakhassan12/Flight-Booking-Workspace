
import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { SeatClass } from '../../types/enum/seat-class.enum';

export class CreateSeatDto {
  @IsUUID()
  flightId!: string;

  @IsString()
  @MaxLength(10)
  seatNumber!: string;

  @IsEnum(SeatClass)
  class!: SeatClass;
}
