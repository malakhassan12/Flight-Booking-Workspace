import { Controller } from '@nestjs/common';
import { SeatService } from './seat.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFlightSeatsDto } from './dto/create-flight-seats.dto';
import { LockSeatDto } from './dto/Lock-seat.dto';
import { SeatBookingDto } from './dto/seat-booking.dto';
import {
  SeatRequestDto,
  UpdateSeatDto,
} from '@flight-booking-workspace/common';

@Controller()
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @EventPattern('flight.created')
  async handleFlightCreated(@Payload() data: CreateFlightSeatsDto) {
    console.log('========== FLIGHT.CREATED RECEIVED ==========');
    console.log(data);

    await this.seatService.createSeat(data);
  }

  @MessagePattern('seat.update')
  updateSeat(@Payload() data: UpdateSeatDto) {
    return this.seatService.updateSeat(data);
  }

  @MessagePattern('seat.remove')
  removeSeat(@Payload() id: string) {
    return this.seatService.removeSeat(id);
  }

  @MessagePattern('seat.getAllByFlight')
  getAllSeatByFlight(@Payload() flightId: string) {
    return this.seatService.getSeatsByFlight(flightId);
  }

  @MessagePattern('seat.checkAvailability')
  checkAvailability(@Payload() SeatRequest: SeatRequestDto) {
    return this.seatService.checkAvailability(SeatRequest);
  }

  @MessagePattern('seat.getStatus')
  getStatus(@Payload() SeatRequest: SeatRequestDto) {
    return this.seatService.getStatus(SeatRequest);
  }

  @MessagePattern('seat.getAvailableSeats')
  getAvailableSeats(@Payload() flightId: string) {
    return this.seatService.getAvailableSeats(flightId);
  }

  @MessagePattern('seat.lockSeat')
  lockSeat(@Payload() lockSeat: LockSeatDto) {
    return this.seatService.lockSeat(lockSeat);
  }

  @MessagePattern('seat.confirmSeat')
  confirmSeat(@Payload() seatBooking: SeatBookingDto) {
    return this.seatService.confirmSeat(seatBooking);
  }

  @MessagePattern('seat.releaseSeat')
  releaseSeat(@Payload() seatBooking: SeatBookingDto) {
    return this.seatService.releaseSeat(seatBooking);
  }

  @MessagePattern('seat.lockSeat')
  releaseAllSeat(@Payload() bookingId: string) {
    return this.seatService.releaseAllSeat(bookingId);
  }

  @MessagePattern('seat.getBookingSeats')
  getBookingSeats(@Payload() bookingId: string) {
    return this.seatService.getBookingSeats(bookingId);
  }

  @MessagePattern('seat.disable')
  disableSeat(@Payload() seatId: string) {
    return this.seatService.disableSeat(seatId);
  }

  @MessagePattern('seat.enable')
  enableSeat(@Payload() seatId: string) {
    return this.seatService.enableSeat(seatId);
  }
}
