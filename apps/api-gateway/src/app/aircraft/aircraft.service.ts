import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateAircraftDto,
  UpdateAircraftDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class AircraftService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async findAll(page = 1, limit = 10) {
    return firstValueFrom(
      this.flightClient.send('aircraft.findAll', {
        page,
        limit,
      }),
    );
  }

  async findAircarftModelByAircraft(id: string) {
    return firstValueFrom(
      this.flightClient.send('aircarftModel.findByAircraft', id),
    );
  }

  async findManufacturerByAircraft(id: string) {
    return firstValueFrom(
      this.flightClient.send('manufacturer.findByAircraft', id),
    );
  }

  async findFlightsByAircraftId(id: string) {
    return firstValueFrom(this.flightClient.send('flight.findByAircraft', id));
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('aircraft.findOne', id));
  }

  async create(input: CreateAircraftDto) {
    return firstValueFrom(this.flightClient.send('aircraft.create', input));
  }

  async update(input: UpdateAircraftDto) {
    return firstValueFrom(this.flightClient.send('aircraft.update', input));
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('aircraft.remove', id));
  }
}
