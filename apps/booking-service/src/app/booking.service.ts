import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
