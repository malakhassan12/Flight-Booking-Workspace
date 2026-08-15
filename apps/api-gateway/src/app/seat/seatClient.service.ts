import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SeatClientService implements OnModuleInit {
  constructor(
    @Inject('SEAT_SERVICE')
    private readonly seatClient: ClientKafka,
  ) {}

  async onModuleInit() {
    console.log('🔥 SEAT CLIENT SERVICE INIT');
    const patterns = [
      'seat.update',
      'seat.remove',
      'seat.getAllByFlight',
      'seat.getAvailableSeats',
      'seat.getBookingSeats',
      'seat.disable',
      'seat.enable',
    ];

    for (const pattern of patterns) {
      this.seatClient.subscribeToResponseOf(pattern);
    }

    await this.seatClient.connect();

    console.log('🔥 SEAT CLIENT CONNECTED');

    console.log('========== KAFKA CONNECTED From seat client ==========');
  }
}
