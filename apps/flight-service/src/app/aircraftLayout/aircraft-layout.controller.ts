import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AircraftLayoutService } from './aircraft-layout.service';

import {
  CreateAircraftLayoutDto,
  UpdateAircarftLayoutDto,
} from '@flight-booking-workspace/common';

@Controller()
export class AircraftLayoutController {
  constructor(private readonly aircraftLayoutService: AircraftLayoutService) {}

  // =========================
  // CREATE
  // =========================

  @MessagePattern('aircraftLayout.create')
  async create(@Payload() createDto: CreateAircraftLayoutDto) {
    return this.aircraftLayoutService.create(createDto);
  }

  // =========================
  // GET ALL
  // =========================

  @MessagePattern('aircraftLayout.findAll')
  async findAll(@Payload() data: { page: number; limit: number }) {
    return this.aircraftLayoutService.findAll(data.page, data.limit);
  }

  // =========================
  // GET ONE BY ID
  // =========================

  @MessagePattern('aircraftLayout.findOne')
  async findOne(@Payload() id: string) {
    return this.aircraftLayoutService.findOne(id);
  }

  // =========================
  // GET BY Aircraft Layout   
  // =========================

  @MessagePattern('aircraftModel.findByAircraftLayout')
  async findByAircraftLayout(@Payload() id: string) {
    return this.aircraftLayoutService.findByAircraftLayout(id);
  }

  // =========================
  // GET BY AIRCRAFT MODEL <----
  // =========================

  @MessagePattern('aircraftLayout.findByAircraftModel')
  async findByAircraftModel(@Payload() aircraftModelId: string) {
    return this.aircraftLayoutService.findByAircraftModel(aircraftModelId);
  }

  // =========================
  // UPDATE
  // =========================

  @MessagePattern('aircraftLayout.update')
  async update(
    @Payload()
    data: UpdateAircarftLayoutDto,
  ) {
    return this.aircraftLayoutService.update(data);
  }

  // =========================
  // DELETE
  // =========================

  @MessagePattern('aircraftLayout.remove')
  async remove(@Payload() id: string) {
    return this.aircraftLayoutService.remove(id);
  }
}
