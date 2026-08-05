import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(3, 3)
  iataCode!: string;

  @IsString()
  @Length(4, 4)
  icaoCode!: string;

  @IsUUID()
  cityId!: string;

  @IsString()
  @IsNotEmpty()
  timezone!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;
}
