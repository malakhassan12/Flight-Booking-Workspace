import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ManufacturerService } from './manufacturer.service';

import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
  Role,
} from '@flight-booking-workspace/common';

import { Roles } from '@flight-booking-workspace/security';
import { Manufacturer } from '@flight-booking-workspace/graphql-types';
import { UseFilters } from '@nestjs/common';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';

@Resolver('Manufacturer')
@UseFilters(GraphqlExceptionFilter)
export class ManufacturerResolver {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Query('manufacturers')
  getAManufacturer(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.manufacturerService.findAll(page, limit);
  }

  @Query('manufacturer')
  getManufacturer(@Args('id') id: string) {
    return this.manufacturerService.findOne(id);
  }

  @ResolveField('aircraftList')
  aircraftList(@Parent() manufacturer: Manufacturer) {
    return this.manufacturerService.findAircraftListByManufacturerId(
      manufacturer.id,
    );
  }

  @ResolveField('country')
  country(@Parent() manufacturer: Manufacturer) {
    return this.manufacturerService.findCountryByManufacturerId(
      manufacturer.id,
    );
  }

  @ResolveField('aircraftModels')
  aircraftModels(@Parent() manufacturer: Manufacturer) {
    return this.manufacturerService.findAircraftModelsByManufacturerId(
      manufacturer.id,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation('createManufacturer')
  createManufacturer(@Args('input') input: CreateManufacturerDto) {
    return this.manufacturerService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateManufacturer')
  updateManufacturer(@Args('input') input: UpdateManufacturerDto) {
    return this.manufacturerService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeManufacturer')
  removeManufacturer(@Args('id') id: string) {
    return this.manufacturerService.remove(id);
  }
}
