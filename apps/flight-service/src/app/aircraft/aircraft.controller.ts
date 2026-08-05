import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AircraftService } from './aircraft.service';
import {
  CreateAircraftDto,
  UpdateAircraftDto,
} from '@flight-booking-workspace/common';

@Controller()
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @MessagePattern('aircraft.create')
  create(@Payload() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @MessagePattern('aircarftModel.findByAircraft')
  aircarftModel(@Payload() id: string) {
    return this.aircraftService.findAircarftModelByAircraft(id);
  }

  @MessagePattern('manufacturer.findByAircraft')
  manufacturer(@Payload() id: string) {
    return this.aircraftService.findManufacturerByAircraft(id);
  }

  @MessagePattern('flight.findByAircraft')
  flights(@Payload() aircraftId: string) {
    return this.aircraftService.findFlightsByAircraft(aircraftId);
  }

  @MessagePattern('aircraft.findAll')
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.aircraftService.findAll(data.page, data.limit);
  }

  @MessagePattern('aircraft.findOne')
  findOne(@Payload() id: string) {
    return this.aircraftService.findOne(id);
  }

  @MessagePattern('aircraft.update')
  update(@Payload() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(updateAircraftDto.id, updateAircraftDto);
  }

  @MessagePattern('aircraft.remove')
  remove(@Payload() id: string) {
    return this.aircraftService.remove(id);
  }
}
