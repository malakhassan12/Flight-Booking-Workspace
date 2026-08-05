import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AirportService } from './airport.service';
import {
  CreateAirportDto,
  UpdateAirportDto,
} from '@flight-booking-workspace/common';

@Controller()
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @MessagePattern('airport.create')
  create(@Payload() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @MessagePattern('city.findByAirport')
  city(@Payload() id: string) {
    return this.airportService.FindCityByAirport(id);
  }

  @MessagePattern('airport.findAll')
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.airportService.findAll(data.page, data.limit);
  }

  @MessagePattern('airport.findOne')
  findOne(@Payload() id: string) {
    return this.airportService.findOne(id);
  }

  @MessagePattern('airport.update')
  update(@Payload() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(updateAirportDto.id, updateAirportDto);
  }

  @MessagePattern('airport.remove')
  remove(@Payload() id: string) {
    return this.airportService.remove(id);
  }
}
