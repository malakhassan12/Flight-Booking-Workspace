import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FlightService } from './flight.service';

import {
  CreateFlightDto,
  UpdateFlightDto,
  ChangeStatusDto,
} from '@flight-booking-workspace/common';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @MessagePattern('flight.create')
  create(@Payload() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @MessagePattern('airline.findByFlight')
  findAirlineByFlight(@Payload() flightId: string) {
    return this.flightService.findAirlineByFlight(flightId);
  }

  @MessagePattern('aircraft.findByFlight')
  findAircraftByFlight(@Payload() flightId: string) {
    return this.flightService.findAircraftByFlight(flightId);
  }

  @MessagePattern('airport.findOriginByFlight')
  findOriginAirportByFlight(@Payload() flightId: string) {
    return this.flightService.findOriginAirportByFlight(flightId);
  }

  @MessagePattern('airport.findDestinationByFlight')
  findDestinationAirportByFlight(@Payload() flightId: string) {
    return this.flightService.findDestinationAirportByFlight(flightId);
  }

  @MessagePattern('flight.findAll')
  findAll(
    @Payload()
    data: {
      page: number;
      limit: number;
    },
  ) {
    return this.flightService.findAll(data.page, data.limit);
  }

  @MessagePattern('flight.findOne')
  findOne(@Payload() id: string) {
    return this.flightService.findOne(id);
  }

  @MessagePattern('flight.update')
  update(@Payload() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(updateFlightDto.id, updateFlightDto);
  }

  @MessagePattern('flight.remove')
  remove(@Payload() id: string) {
    return this.flightService.remove(id);
  }

  @MessagePattern('flight.changeStatus')
  changeStatus(@Payload() changeStatusDto: ChangeStatusDto) {
    return this.flightService.changeStatus(changeStatusDto);
  }
}
