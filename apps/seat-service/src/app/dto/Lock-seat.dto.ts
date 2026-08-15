import {
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';

export class LockSeatDto {
  @IsUUID()
  flightId!: string;

  @IsUUID()
  seatId!: string;

  @IsUUID()
  bookingId!: string;

  @IsInt()
  @Min(1)
  expiresIn!: number;
}
