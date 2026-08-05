import { IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateManufacturerDto } from './create-manufacturer.dto';

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {
    @IsUUID()

  id!: string;
}
