import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  UpdateSeatDto,
} from '@flight-booking-workspace/common';

@Injectable()
export class SeatService {
  constructor(
    @Inject('SEAT_SERVICE')
    private readonly seatClient: ClientKafka,
  ) {}

  getAllSeatsByFlight(flightId: string) {
    return firstValueFrom(
      this.seatClient.send('seat.getAllByFlight',  flightId ),
    );
  }


  getAvailableSeats(flightId: string) {
    return firstValueFrom(
      this.seatClient.send('seat.getAvailableSeats', flightId ),
    );
  }

  getBookingSeats(bookingId: string) {
    return firstValueFrom(
      this.seatClient.send('seat.getBookingSeats',  bookingId ),
    );
  }

  updateSeat(updateSeatDto: UpdateSeatDto) {
    return firstValueFrom(
      this.seatClient.send('seat.update', updateSeatDto ),
    );
  }

  removeSeat(id: string) {
    return firstValueFrom(this.seatClient.send('seat.remove',  id ));
  }

  disableSeat(seatId: string) {
    return firstValueFrom(this.seatClient.send('seat.disable',  seatId ));
  }

  enableSeat(seatId: string) {
    return firstValueFrom(this.seatClient.send('seat.enable',  seatId ));
  }
}
