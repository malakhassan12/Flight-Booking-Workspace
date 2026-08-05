import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateAirlineDto,
  UpdateAirlineDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class AirlineService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async findAll(page = 1, limit = 10) {
    console.log('🔥 AIRLINE SERVICE FIND ALL');
    return firstValueFrom(
      this.flightClient.send('airline.findAll', {
        page,
        limit,
      }),
    );
  }

  async findCountryByAirlineId(id: string) {
    return firstValueFrom(this.flightClient.send('country.findByAirline', id));
  }

  async findByAirlineId(airlineId: string) {
    return firstValueFrom(
      this.flightClient.send('flight.findByAirline', airlineId),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('airline.findOne', id));
  }

  async create(input: CreateAirlineDto) {
    return firstValueFrom(this.flightClient.send('airline.create', input));
  }

  async update(input: UpdateAirlineDto) {
    return firstValueFrom(this.flightClient.send('airline.update', input));
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('airline.remove', id));
  }
}
