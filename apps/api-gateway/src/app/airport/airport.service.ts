import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateAirportDto,
  UpdateAirportDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class AirportService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async FindCityByAirport(id: string) {
    return firstValueFrom(this.flightClient.send('city.findByAirport', id));
  }

  async findAll(page = 1, limit = 10) {
    console.log('🔥 AIRPORT SERVICE FIND ALL');
    return firstValueFrom(
      this.flightClient.send('airport.findAll', {
        page,
        limit,
      }),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('airport.findOne', id));
  }

  async create(input: CreateAirportDto) {
    return firstValueFrom(this.flightClient.send('airport.create', input));
  }

  async update(input: UpdateAirportDto) {
    return firstValueFrom(this.flightClient.send('airport.update', input));
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('airport.remove', id));
  }
}
