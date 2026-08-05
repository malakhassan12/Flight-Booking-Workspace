import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AircraftModelService } from './aircraft-model.service';
import {
  CreateAircraftModelDto,
  UpdateAircraftModelDto,
} from '@flight-booking-workspace/common';

@Controller()
export class AircraftModelController {
  constructor(private readonly aircraftModelService: AircraftModelService) {}

  @MessagePattern('aircraftModel.create')
  create(@Payload() createAircraftModelDto: CreateAircraftModelDto) {
    return this.aircraftModelService.create(createAircraftModelDto);
  }

  @MessagePattern('aircraftList.findByModel')
  findAircraftListByModelId(@Payload() modelId: string) {
    return this.aircraftModelService.findAircraftListByModelId(modelId);
  }

  @MessagePattern('manufacturer.findByAircraftModel')
  findManufacturerByModelId(@Payload() modelId: string) {
    return this.aircraftModelService.findManufacturerByModelId(modelId);
  }

  @MessagePattern('aircraftModel.findAll')
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.aircraftModelService.findAll(data.page, data.limit);
  }

  @MessagePattern('aircraftModel.findOne')
  findOne(@Payload() id: string) {
    return this.aircraftModelService.findOne(id);
  }

  @MessagePattern('aircraftModel.update')
  update(@Payload() updateAircraftModelDto: UpdateAircraftModelDto) {
    return this.aircraftModelService.update(
      updateAircraftModelDto.id,
      updateAircraftModelDto,
    );
  }

  @MessagePattern('aircraftModel.remove')
  remove(@Payload() id: string) {
    return this.aircraftModelService.remove(id);
  }
}
