import { UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AircraftService } from './aircraft.service';
import { Roles } from '@flight-booking-workspace/security';

import {
  CreateAircraftDto,
  UpdateAircraftDto,
  Role,
} from '@flight-booking-workspace/common';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';
import {
  Aircraft,
} from '@flight-booking-workspace/graphql-types';

@Resolver('Aircraft')
@UseFilters(GraphqlExceptionFilter)
export class AircraftResolver {
  constructor(private readonly aircraftService: AircraftService) {}

  @Query('aircraftList')
  getAircrafts(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.aircraftService.findAll(page, limit);
  }

  @Query('aircraft')
  getAircraft(@Args('id') id: string) {
    return this.aircraftService.findOne(id);
  }

  @ResolveField('model')
  aircraftModel(@Parent() aircraft: Aircraft) {
    return this.aircraftService.findAircarftModelByAircraft(aircraft.id);
  }

  @ResolveField('manufacturer')
  manufacturer(@Parent() aircraft: Aircraft) {
    return this.aircraftService.findManufacturerByAircraft(aircraft.id);
  }

  @ResolveField('flights')
  flights(@Parent() aircraft: Aircraft) {
    return this.aircraftService.findFlightsByAircraftId(aircraft.id);
  }

  @Roles(Role.ADMIN)
  @Mutation('createAircraft')
  createAircraft(@Args('input') input: CreateAircraftDto) {
    return this.aircraftService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateAircraft')
  updateAircraft(@Args('input') input: UpdateAircraftDto) {
    return this.aircraftService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeAircraft')
  removeAircraft(@Args('id') id: string) {
    return this.aircraftService.remove(id);
  }
}
