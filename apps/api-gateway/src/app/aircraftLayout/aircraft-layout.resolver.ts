import { UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  CreateAircraftLayoutDto,
  UpdateAircarftLayoutDto,
  Role,
} from '@flight-booking-workspace/common';

import { Roles } from '@flight-booking-workspace/security';

import { GraphqlExceptionFilter } from '../../filter/graphql-filter';
import { AircraftLayoutService } from './aircraft-layout.service';

@Resolver('AircraftLayout')
@UseFilters(GraphqlExceptionFilter)
export class AircraftLayoutResolver {
  constructor(private readonly aircraftLayoutService: AircraftLayoutService) {}

  // =========================
  // CREATE
  // =========================

  @Roles(Role.ADMIN)
  @Mutation('createAircraftLayout')
  create(@Args('input') input: CreateAircraftLayoutDto) {
    return this.aircraftLayoutService.create(input);
  }

  // =========================
  // GET ALL
  // =========================

  @Query('getAllAircraftLayouts')
  findAll(@Args('page') page: number, @Args('limit') limit: number) {
    return this.aircraftLayoutService.findAll(page, limit);
  }

  // =========================
  // GET ONE
  // =========================

  @Query('getAircraftLayout')
  findOne(@Args('id') id: string) {
    return this.aircraftLayoutService.findOne(id);
  }

  // =========================
  // GET BY AIRCRAFT MODEL
  // =========================

  @ResolveField('aircraftModel')
  aircraftModel(@Parent() aircraftLayout: { id: string }) {
    return this.aircraftLayoutService.aircraftModel(aircraftLayout.id);
  }
  // =========================
  // UPDATE
  // =========================

  @Roles(Role.ADMIN)
  @Mutation('updateAircraftLayout')
  update(@Args('input') input: UpdateAircarftLayoutDto) {
    return this.aircraftLayoutService.update(input);
  }

  // =========================
  // DELETE
  // =========================

  @Roles(Role.ADMIN)
  @Mutation('removeAircraftLayout')
  remove(@Args('id') id: string) {
    return this.aircraftLayoutService.remove(id);
  }
}
