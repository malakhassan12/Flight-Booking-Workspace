import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;
}
