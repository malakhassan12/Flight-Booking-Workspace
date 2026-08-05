import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ManufacturerService } from './manufacturer.service';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from '@flight-booking-workspace/common';

@Controller()
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @MessagePattern('manufacturer.create')
  create(@Payload() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @MessagePattern('manufacturer.findAll')
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.manufacturerService.findAll(data.page, data.limit);
  }

   @MessagePattern('country.findByManufacturer')
  country(@Payload() id: string) {
    return this.manufacturerService.findCountryByManufacturerId(id);
  }



  @MessagePattern('aircraftList.findAll')
  findAircraftList(@Payload() id: string) {
    return this.manufacturerService.findAircraftListByManufacturerId(id);
  }

  @MessagePattern('aircraftModels.findAll')
  findAircraftModels(@Payload() id: string) {
    return this.manufacturerService.findAircraftModelsByManufacturerId(id);
  }

  @MessagePattern('manufacturer.findOne')
  findOne(@Payload() id: string) {
    return this.manufacturerService.findOne(id);
  }

  @MessagePattern('manufacturer.update')
  update(@Payload() updateManufacturerDto: UpdateManufacturerDto) {
    return this.manufacturerService.update(
      updateManufacturerDto.id,
      updateManufacturerDto,
    );
  }

  @MessagePattern('manufacturer.remove')
  remove(@Payload() id: string) {
    return this.manufacturerService.remove(id);
  }
}
