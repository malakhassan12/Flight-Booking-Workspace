import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAircraftModelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  manufacturerId!: string;
}