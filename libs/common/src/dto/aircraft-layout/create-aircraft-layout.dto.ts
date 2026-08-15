import { IsInt, IsUUID, Min } from "class-validator";

export class CreateAircraftLayoutDto {
  @IsUUID()
  aircraftModelId!: string;

  @IsInt()
  @Min(1)
  rows!: number;

  @IsInt()
  @Min(1)
  seatsPerRow!: number;
}
