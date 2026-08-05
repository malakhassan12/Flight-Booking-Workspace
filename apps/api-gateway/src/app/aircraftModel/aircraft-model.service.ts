import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateAircraftModelDto,
  UpdateAircraftModelDto,
} from '@flight-booking-workspace/common';
@Injectable()
export class AircraftModelService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async findAircraftListByModelId(modelId: string) {
    return firstValueFrom(
      this.flightClient.send('aircraftList.findByModel', modelId),
    );
  }

  async findManufacturerByModelId(modelId: string) {
    return firstValueFrom(
      this.flightClient.send('manufacturer.findByAircraftModel', modelId),
    );
  }

  async findAll(page = 1, limit = 10) {
    return firstValueFrom(
      this.flightClient.send('aircraftModel.findAll', {
        page,
        limit,
      }),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftModel.findOne', id));
  }

  async create(input: CreateAircraftModelDto) {
    return firstValueFrom(
      this.flightClient.send('aircraftModel.create', input),
    );
  }

  async update(input: UpdateAircraftModelDto) {
    return firstValueFrom(
      this.flightClient.send('aircraftModel.update', input),
    );
  }

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftModel.remove', id));
  }
}
