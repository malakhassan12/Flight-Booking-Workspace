import { UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AircraftModelService } from './aircraft-model.service';
import { Roles } from '@flight-booking-workspace/security';

import {
  CreateAircraftModelDto,
  UpdateAircraftModelDto,
  Role,
} from '@flight-booking-workspace/common';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';

import { AircraftModel } from '@flight-booking-workspace/graphql-types';

@Resolver('AircraftModel')
@UseFilters(GraphqlExceptionFilter)
export class AircraftModelResolver {
  constructor(private readonly aircraftModelService: AircraftModelService) {}

  @Query('aircraftModels')
  getAircraftModels(@Args('page') page = 1, @Args('limit') limit = 10) {
    return this.aircraftModelService.findAll(page, limit);
  }

  @ResolveField('manufacturer') manufacturer(
    @Parent() aircraftModel: AircraftModel,
  ) {
    return this.aircraftModelService.findManufacturerByModelId(
      aircraftModel.id,
    );
  }

  @ResolveField('aircraftList') aircraftList(
    @Parent() aircraftModel: AircraftModel,
  ) {
    return this.aircraftModelService.findAircraftListByModelId(
      aircraftModel.id,
    );
  }

  @ResolveField('aircraftLayout') aircraftLayout(
    @Parent() aircraftModel: AircraftModel,
  ) {
    return this.aircraftModelService.findLayoutByModelId(
      aircraftModel.id,
    );
  }

  @Query('aircraftModel')
  getAircraftModel(@Args('id') id: string) {
    return this.aircraftModelService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('createAircraftModel')
  createAircraftModel(@Args('input') input: CreateAircraftModelDto) {
    return this.aircraftModelService.create(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('updateAircraftModel')
  updateAircraftModel(@Args('input') input: UpdateAircraftModelDto) {
    return this.aircraftModelService.update(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeAircraftModel')
  removeAircraftModel(@Args('id') id: string) {
    return this.aircraftModelService.remove(id);
  }
}
