import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(2, 10)
  code!: string;

  @IsUUID()
  countryId!: string;
}
