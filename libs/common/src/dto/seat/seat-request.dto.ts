import { IsUUID } from "class-validator";

export class SeatRequestDto {
  @IsUUID()
  flightId!: string;

  @IsUUID()
  seatId!: string;
}
