import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateAircraftLayoutDto,
  UpdateAircarftLayoutDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class AircraftLayoutService {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(createDto: CreateAircraftLayoutDto) {
    return firstValueFrom(
      this.flightClient.send('aircraftLayout.create', createDto),
    );
  }

  // =========================
  // GET ALL
  // =========================

  async findAll(page: number, limit: number) {
    return firstValueFrom(
      this.flightClient.send('aircraftLayout.findAll', {
        page,
        limit,
      }),
    );
  }

  // =========================
  // GET ONE
  // =========================

  async findOne(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftLayout.findOne', id));
  }

  // =========================
  // GET BY AIRCRAFT Layout
  // =========================

  async aircraftModel(aircraftLayoutId: string) {
    return firstValueFrom(
      this.flightClient.send(
        'aircraftModel.findByAircraftLayout',
        aircraftLayoutId,
      ),
    );
  }
  // =========================
  // UPDATE
  // =========================

  async update(data: UpdateAircarftLayoutDto) {
    return firstValueFrom(
      this.flightClient.send('aircraftLayout.update', data),
    );
  }

  // =========================
  // DELETE
  // =========================

  async remove(id: string) {
    return firstValueFrom(this.flightClient.send('aircraftLayout.remove', id));
  }
}
