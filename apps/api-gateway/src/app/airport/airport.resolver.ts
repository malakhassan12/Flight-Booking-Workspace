import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AirportService } from './airport.service';
import {
  CreateAirportDto,
  UpdateAirportDto,
  Role,
} from '@flight-booking-workspace/common';

import { Roles } from '@flight-booking-workspace/security';
import { UseFilters } from '@nestjs/common';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';
import { Airport } from '@flight-booking-workspace/graphql-types';

@Resolver('Airport')
@UseFilters(GraphqlExceptionFilter)
export class AirportResolver {
  constructor(private readonly airportService: AirportService) {}

  @Query('airports')
  getAirports(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.airportService.findAll(page, limit);
  }

  @ResolveField('city')
  city(@Parent() airport: Airport) {
    return this.airportService.FindCityByAirport(airport.id);
  }

  @Query('airport')
  getAirport(@Args('id') id: string) {
    return this.airportService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('createAirport')
  createAirport(@Args('input') input: CreateAirportDto) {
    return this.airportService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateAirport')
  updateAirport(@Args('input') input: UpdateAirportDto) {
    return this.airportService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeAirport')
  removeAirport(@Args('id') id: string) {
    return this.airportService.remove(id);
  }
}
