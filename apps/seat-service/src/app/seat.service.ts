import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Seat, SeatClass, SeatStatus } from './entity/seat.entity';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';

import {
  DataResponse,
  RpcHttpException,
} from '@flight-booking-workspace/common';
import {
  SeatRequestDto,
  UpdateSeatDto,
} from '@flight-booking-workspace/common';
import { LockSeatDto } from './dto/Lock-seat.dto';
import { SeatBookingDto } from './dto/seat-booking.dto';
import { randomUUID } from 'crypto';
import { CreateFlightSeatsDto } from './dto/create-flight-seats.dto';
import { RedisService } from '@flight-booking-workspace/redis';

/*

Event Pattern

    Flight Cancelled
    Booking Created
    Booking Cancelled
    Payment Completed
    Payment Failed

*/
@Injectable()
export class SeatService implements OnModuleInit {
  constructor(
    @Inject('SEAT_REPOSITORY')
    private seatRepository: Repository<Seat>,
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,

    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    const patterns = ['aircraftLayout.findByAircraftModel', 'flight.findOne'];

    for (const pattern of patterns) {
      this.flightClient.subscribeToResponseOf(pattern);
    }

    await this.flightClient.connect();

    console.log(
      '========== KAFKA CONNECTED To Flight client From Seat client ==========',
    );
  }
  async createSeat(data: CreateFlightSeatsDto) {
    try {
      const { flightId, aircraftModelId } = data;

      // 1. Get Aircraft Layout from Flight Service
      const layout = await lastValueFrom(
        this.flightClient
          .send('aircraftLayout.findByAircraftModel', aircraftModelId)
          .pipe(
            catchError((err) => {
              return throwError(() => err);
            }),
          ),
      );

      if (!layout) {
        throw new RpcHttpException(404, 'Aircraft layout not found');
      }

      // 2. Generate seats
      const seats = [];

      for (let row = 1; row <= layout.rows; row++) {
        for (let i = 0; i < layout.seatsPerRow; i++) {
          const position = String.fromCharCode(65 + i);

          seats.push(
            this.seatRepository.create({
              flightId,
              seatNumber: `${row}${position}`,
              class: SeatClass.ECONOMY,
              status: SeatStatus.AVAILABLE,
              isActive: true,
              bookingId: null,
            }),
          );
        }
      }

      // 3. Save all seats
      await this.seatRepository.save(seats);

      return new DataResponse('Seats created successfully', 201);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async updateSeat(updateSeatDto: UpdateSeatDto) {
    try {
      const { id, ...data } = updateSeatDto;

      // 1. Check if seat exists
      const seat = await this.seatRepository.findOne({
        where: { id },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      // 2. Update seat
      this.seatRepository.merge(seat, data);

      // 3. Save changes
      await this.seatRepository.save(seat);

      // 4. Return response
      return new DataResponse('Seat updated successfully', 200);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async removeSeat(seatId: string) {
    const seat = await this.seatRepository.findOne({
      where: {
        id: seatId,
      },
    });

    if (!seat) {
      throw new RpcHttpException(404, 'Seat not found');
    }

    // Don't delete a booked seat
    if (seat.status === SeatStatus.BOOKED) {
      throw new RpcHttpException(400, 'Cannot remove a booked seat');
    }

    await this.seatRepository.remove(seat);

    return new DataResponse('Seat removed successfully', 200);
  }
  async getSeatsByFlight(flightId: string) {
    try {
      const existFlight = await lastValueFrom(
        this.flightClient.send('flight.findOne', flightId).pipe(
          catchError((err) => {
            return throwError(() => err);
          }),
        ),
      );

      if (!existFlight) {
        throw new RpcHttpException(404, 'Flight not found');
      }

      const [seats, numberOfSeats] = await this.seatRepository.findAndCount({
        where: {
          flightId,
        },
      });

      return new DataResponse<{
        seats: Seat[];
        numberOfSeats: number;
      }>('Selected seats successfully', 200, {
        seats,
        numberOfSeats,
      });
    } catch (e: unknown) {
      const error = e as { statusCode?: number; message?: string };
      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async checkAvailability(seatRequest: SeatRequestDto) {
    const seat = await this.seatRepository.findOne({
      where: {
        id: seatRequest.seatId,
        flightId: seatRequest.flightId,
        status: SeatStatus.AVAILABLE,
      },
    });

    if (!seat) {
      throw new RpcHttpException(404, 'Seat not found');
    }

    return !!seat;
  }
  async getStatus(SeatRequest: SeatRequestDto) {
    const seat = await this.seatRepository.findOne({
      where: {
        id: SeatRequest.seatId,
        flightId: SeatRequest.flightId,
      },
      select: {
        status: true,
      },
    });

    if (!seat) {
      throw new RpcHttpException(404, 'Seat not found');
    }

    return seat.status;
  }
  async getAvailableSeats(flightId: string) {
    try {
      const existFlight = await lastValueFrom(
        this.flightClient.send('flight.findOne', flightId).pipe(
          catchError((err) => {
            return throwError(() => err);
          }),
        ),
      );

      if (!existFlight) {
        throw new RpcHttpException(404, 'Flight not found');
      }

      const [seats, numberOfSeats] = await this.seatRepository.findAndCount({
        where: {
          flightId,
          status: SeatStatus.AVAILABLE,
        },
      });

      return new DataResponse<{
        seats: Seat[];
        numberOfSeats: number;
      }>('Selected seats successfully', 200, {
        seats,
        numberOfSeats,
      });
    } catch (e: unknown) {
      const error = e as { statusCode?: number; message?: string };
      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async lockSeat(lockSeat: LockSeatDto) {
    try {
      // 1. Check flight
      const existFlight = await lastValueFrom(
        this.flightClient.send('flight.findOne', lockSeat.flightId),
      );

      if (!existFlight) {
        throw new RpcHttpException(404, 'Flight not found');
      }

      // 2. Find seat belonging to this flight
      const seat = await this.seatRepository.findOne({
        where: {
          id: lockSeat.seatId,
          flightId: lockSeat.flightId,
        },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      // 3. Check permanent seat status
      if (seat.status === SeatStatus.BOOKED) {
        throw new RpcHttpException(409, 'Seat is already booked');
      }

      if (seat.status === SeatStatus.DISABLED) {
        throw new RpcHttpException(409, 'Seat is disabled');
      }

      // 4. Create Redis lock
      const client = this.redisService.getClient();

      const key = `seat-lock:${lockSeat.seatId}`;
      const lockId = randomUUID();

      const result = await client.set(
        key,
        JSON.stringify({
          lockId,
          bookingId: lockSeat.bookingId,
        }),
        {
          NX: true,
          EX: lockSeat.expiresIn,
        },
      );

      // 5. Lock already exists
      if (result !== 'OK') {
        throw new RpcHttpException(409, 'Seat is currently locked');
      }

      return new DataResponse('Seat locked successfully', 200);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async confirmSeat(seatBooking: SeatBookingDto) {
    try {
      const client = this.redisService.getClient();

      // 1. Get the Redis lock
      const key = `seat-lock:${seatBooking.seatId}`;

      const lockData = await client.get(key);

      if (!lockData) {
        throw new RpcHttpException(
          409,
          'Seat lock has expired or does not exist',
        );
      }

      // 2. Parse lock data
      const lock = JSON.parse(lockData) as {
        lockId: string;
        bookingId: string;
      };

      // 3. Make sure this booking owns the lock
      if (lock.bookingId !== seatBooking.bookingId) {
        throw new RpcHttpException(
          409,
          'This booking does not own the seat lock',
        );
      }

      // 4. Find the seat
      const seat = await this.seatRepository.findOne({
        where: {
          id: seatBooking.seatId,
          flightId: seatBooking.flightId,
        },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      // 5. Make sure the seat is not already booked
      if (seat.status === SeatStatus.BOOKED) {
        throw new RpcHttpException(409, 'Seat is already booked');
      }

      // 6. Confirm the seat in PostgreSQL
      seat.status = SeatStatus.BOOKED;
      seat.bookingId = seatBooking.bookingId;

      await this.seatRepository.save(seat);

      // 7. Remove temporary Redis lock
      await client.del(key);

      return new DataResponse('Seat confirmed successfully', 200);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async releaseSeat(seatBooking: SeatBookingDto) {
    try {
      const client = this.redisService.getClient();

      // 1. Find the seat
      const seat = await this.seatRepository.findOne({
        where: {
          id: seatBooking.seatId,
          flightId: seatBooking.flightId,
        },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      // 2. Make sure the seat is not already booked
      if (seat.status === SeatStatus.BOOKED) {
        throw new RpcHttpException(409, 'Seat is already booked');
      }

      // 3. Get Redis lock
      const key = `seat-lock:${seatBooking.seatId}`;

      const lockData = await client.get(key);

      if (!lockData) {
        throw new RpcHttpException(
          404,
          'Seat lock not found or already expired',
        );
      }

      // 4. Parse lock
      const lock = JSON.parse(lockData) as {
        lockId: string;
        bookingId: string;
      };

      // 5. Verify booking owns the lock
      if (lock.bookingId !== seatBooking.bookingId) {
        throw new RpcHttpException(
          409,
          'This booking does not own the seat lock',
        );
      }



      // 7. Remove Redis lock
      await client.del(key);

      return new DataResponse('Seat released successfully', 200);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async releaseAllSeat(bookingId: string) {
    try {
      const client = this.redisService.getClient();

      let cursor = '0';
      const keysToDelete: string[] = [];

      do {
        const result = await client.scan(cursor, {
          MATCH: 'seat-lock:*',
          COUNT: 100,
        });

        cursor = String(result.cursor);

        for (const key of result.keys) {
          const lockData = await client.get(key);

          if (!lockData) {
            continue;
          }

          const lock = JSON.parse(lockData) as {
            lockId: string;
            bookingId: string;
          };

          if (lock.bookingId === bookingId) {
            keysToDelete.push(key);
          }
        }
      } while (cursor !== '0');

      if (keysToDelete.length === 0) {
        return new DataResponse('No locked seats found for this booking', 200);
      }

      await client.del(keysToDelete);

      return new DataResponse('All seats released successfully', 200);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async getBookingSeats(bookingId: string) {
    try {
      const [seats, numberOfSeats] = await this.seatRepository.findAndCount({
        where: {
          bookingId,
        },
        order: {
          seatNumber: 'ASC',
        },
      });

      return new DataResponse<{
        seats: Seat[];
        numberOfSeats: number;
      }>('Booking seats retrieved successfully', 200, {
        seats,
        numberOfSeats,
      });
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async disableSeat(seatId: string) {
    try {
      const seat = await this.seatRepository.findOne({
        where: {
          id: seatId,
        },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      if (!seat.isActive) {
        throw new RpcHttpException(400, 'Seat is already disabled');
      }

      await this.seatRepository.update(
        {
          id: seatId,
        },
        {
          isActive: false,
        },
      );

      const updatedSeat = await this.seatRepository.findOne({
        where: {
          id: seatId,
        },
      });

      return new DataResponse('Seat disabled successfully', 200, updatedSeat);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
  async enableSeat(seatId: string) {
    try {
      const seat = await this.seatRepository.findOne({
        where: {
          id: seatId,
        },
      });

      if (!seat) {
        throw new RpcHttpException(404, 'Seat not found');
      }

      if (seat.isActive) {
        throw new RpcHttpException(400, 'Seat is already enabled');
      }

      await this.seatRepository.update(
        {
          id: seatId,
        },
        {
          isActive: true,
        },
      );

      const updatedSeat = await this.seatRepository.findOne({
        where: {
          id: seatId,
        },
      });

      return new DataResponse('Seat enabled successfully', 200, updatedSeat);
    } catch (e: unknown) {
      const error = e as {
        statusCode?: number;
        message?: string;
      };

      throw new RpcHttpException(
        error?.statusCode ?? 500,
        error?.message ?? 'Internal server error',
      );
    }
  }
}
