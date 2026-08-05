import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class ManufacturerService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async findAll(page = 1, limit = 10) {
    return firstValueFrom(
      this.flightClient.send('manufacturer.findAll', {
        page,
        limit,
      }),
    );
  }

  async findCountryByManufacturerId(id: string) {
    return firstValueFrom(
      this.flightClient.send('country.findByManufacturer', id),
    );
  }

  async findAircraftListByManufacturerId(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftList.findAll', id));
  }

  async findAircraftModelsByManufacturerId(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftModels.findAll', id));
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('manufacturer.findOne', id));
  }

  async create(input: CreateManufacturerDto) {
    return firstValueFrom(this.flightClient.send('manufacturer.create', input));
  }

  async update(input: UpdateManufacturerDto) {
    return firstValueFrom(this.flightClient.send('manufacturer.update', input));
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('manufacturer.remove', id));
  }
}
