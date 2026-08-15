import { IsUUID } from 'class-validator';

export class SeatBookingDto {
  @IsUUID()
  flightId!: string;

  @IsUUID()
  seatId!: string;

  @IsUUID()
  bookingId!: string;

}
