import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateAircraftDto {
  @IsUUID()
  manufacturerId!: string;

  @IsUUID()
  modelId!: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber!: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  seatCapacity!: number;
}