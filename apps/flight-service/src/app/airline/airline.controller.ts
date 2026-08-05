import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AirlineService } from './airline.service';
import {
  CreateAirlineDto,
  UpdateAirlineDto,
} from '@flight-booking-workspace/common';

@Controller()
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @MessagePattern('airline.create')
  create(@Payload() createAirlineDto: CreateAirlineDto) {
    return this.airlineService.create(createAirlineDto);
  }

  @MessagePattern('airline.findAll')
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.airlineService.findAll(data.page, data.limit);
  }

  @MessagePattern('country.findByAirline')
  country(@Payload() id : string) {
    return this.airlineService.findCountryByAirlineId(id);
  }

  @MessagePattern('flight.findByAirline')
  findByAirline(@Payload() airlineId: string) {
    return this.airlineService.findByAirlineId(airlineId);
  }

  @MessagePattern('airline.findOne')
  findOne(@Payload() id: string) {
    return this.airlineService.findOne(id);
  }

  @MessagePattern('airline.update')
  update(@Payload() updateAirlineDto: UpdateAirlineDto) {
    return this.airlineService.update(updateAirlineDto.id, updateAirlineDto);
  }

  @MessagePattern('airline.remove')
  remove(@Payload() id: string) {
    return this.airlineService.remove(id);
  }
}
