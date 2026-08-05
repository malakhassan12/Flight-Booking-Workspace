import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AirlineService } from './airline.service';

import { Roles } from '@flight-booking-workspace/security';

import {
  CreateAirlineDto,
  UpdateAirlineDto,
  Role,
} from '@flight-booking-workspace/common';
import { UseFilters } from '@nestjs/common';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';

import { Airline } from '@flight-booking-workspace/graphql-types';

@Resolver('Airline')
@UseFilters(GraphqlExceptionFilter)
export class AirlineResolver {
  constructor(private readonly airlineService: AirlineService) {}

  @Query('airlines')
  getAirlines(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.airlineService.findAll(page, limit);
  }

  @ResolveField('flights')
  flights(@Parent() airline: Airline) {
    return this.airlineService.findByAirlineId(airline.id);
  }

  @ResolveField('country')
  city(@Parent() airline: Airline) {
    return this.airlineService.findCountryByAirlineId(airline.id);
  }

  @Query('airline')
  getAirline(@Args('id') id: string) {
    return this.airlineService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('createAirline')
  createAirline(@Args('input') input: CreateAirlineDto) {
    return this.airlineService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateAirline')
  updateAirline(@Args('input') input: UpdateAirlineDto) {
    return this.airlineService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeAirline')
  removeAirline(@Args('id') id: string) {
    return this.airlineService.remove(id);
  }
}
