import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role, UpdateSeatDto } from '@flight-booking-workspace/common';

import { Roles } from '@flight-booking-workspace/security';
import { GraphqlExceptionFilter } from '../../filter/graphql-filter';
import { SeatService } from './seat.service';

@Resolver('Seat')
@UseFilters(GraphqlExceptionFilter)
export class SeatResolver {
  constructor(private readonly seatService: SeatService) {}

  // =========================
  // MUTATIONS
  // =========================

  @Roles(Role.ADMIN)
  @Mutation('updateSeat')
  updateSeat(@Args('input') input: UpdateSeatDto) {
    return this.seatService.updateSeat(input);
  }

  @Roles(Role.ADMIN)
  @Mutation('removeSeat')
  removeSeat(@Args('id') id: string) {
    return this.seatService.removeSeat(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('enableSeat')
  enableSeat(@Args('id') id: string) {
    return this.seatService.enableSeat(id);
  }

  @Roles(Role.ADMIN)
  @Mutation('disableSeat')
  disableSeat(@Args('id') id: string) {
    return this.seatService.disableSeat(id);
  }

  // =========================
  // QUERIES
  // =========================

  @Query('getAllSeatsByFlight')
  getAllSeatsByFlight(@Args('flightId') flightId: string) {
    return this.seatService.getAllSeatsByFlight(flightId);
  }

  @Query('getAvailableSeats')
  getAvailableSeats(@Args('flightId') flightId: string) {
    return this.seatService.getAvailableSeats(flightId);
  }

  @Query('getBookingSeats')
  getBookingSeats(@Args('bookingId') bookingId: string) {
    return this.seatService.getBookingSeats(bookingId);
  }
}
