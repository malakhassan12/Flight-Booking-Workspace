import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  getData() {
    return this.bookingService.getData();
  }
}
