import { UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FlightService } from './flight.service';
import {
  CreateFlightDto,
  UpdateFlightDto,
  ChangeStatusDto,
  Role,
} from '@flight-booking-workspace/common';

import { Roles } from '@flight-booking-workspace/security';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';
import { Flight } from '@flight-booking-workspace/graphql-types';

@Resolver('Flight')
@UseFilters(GraphqlExceptionFilter)
export class FlightResolver {
  constructor(private readonly flightService: FlightService) {}

  @Query('flights')
  getFlights(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.flightService.findAll(page, limit);
  }

  @Query('flight')
  getFlight(@Args('id') id: string) {
    return this.flightService.findOne(id);
  }

  @ResolveField('airline')
  airline(@Parent() flight: Flight) {
    return this.flightService.findAirlineByFlight(flight.id);
  }

  @ResolveField('aircraft')
  aircraft(@Parent() flight: Flight) {
    return this.flightService.findAircraftByFlight(flight.id);
  }

  @ResolveField('origin')
  origin(@Parent() flight: Flight) {
    return this.flightService.findOriginAirportByFlight(flight.id);
  }

  @ResolveField('destination')
  destination(@Parent() flight: Flight) {
    return this.flightService.findDestinationAirportByFlight(flight.id);
  }

  @Roles(Role.ADMIN)
  @Mutation('createFlight')
  createFlight(@Args('input') input: CreateFlightDto) {
    return this.flightService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateFlight')
  updateFlight(@Args('input') input: UpdateFlightDto) {
    return this.flightService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeFlight')
  removeFlight(@Args('id') id: string) {
    return this.flightService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('changeFlightStatus')
  changeFlightStatus(@Args('input') input: ChangeStatusDto) {
    return this.flightService.changeStatus(input);
  }
}
