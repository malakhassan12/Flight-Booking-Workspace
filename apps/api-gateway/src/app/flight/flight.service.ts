import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateFlightDto,
  UpdateFlightDto,
  ChangeStatusDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class FlightService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async findAll(page = 1, limit = 10) {
    return firstValueFrom(
      this.flightClient.send('flight.findAll', {
        page,
        limit,
      }),
    );
  }
  

  async findAirlineByFlight(id: string) {
    return firstValueFrom(this.flightClient.send('airline.findByFlight', id));
  }

  async findAircraftByFlight(id: string) {
    return firstValueFrom(this.flightClient.send('aircraft.findByFlight', id));
  }

  async findOriginAirportByFlight(id: string) {
    return firstValueFrom(
      this.flightClient.send('airport.findOriginByFlight', id),
    );
  }

  async findDestinationAirportByFlight(id: string) {
    return firstValueFrom(
      this.flightClient.send('airport.findDestinationByFlight', id),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('flight.findOne', id));
  }

  async create(input: CreateFlightDto) {
    return firstValueFrom(this.flightClient.send('flight.create', input));
  }

  async update(input: UpdateFlightDto) {
    return firstValueFrom(this.flightClient.send('flight.update', input));
  }

  async changeStatus(input: ChangeStatusDto) {
    return firstValueFrom(this.flightClient.send('flight.changeStatus', input));
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('flight.remove', id));
  }
}
