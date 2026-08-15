import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { Flight, FlightStatus } from '../generated/prisma/client';
import {
  CreateFlightDto,
  UpdateFlightDto,
  ChangeStatusDto,
  RpcHttpException,
  DataResponse,
} from '@flight-booking-workspace/common';

@Injectable()
export class FlightService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async findAirlineByFlight(flightId: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id: flightId,
      },
      include: {
        airline: true,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return flight.airline;
  }

  async findAircraftByFlight(flightId: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id: flightId,
      },
      include: {
        aircraft: true,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return flight.aircraft;
  }

  async findOriginAirportByFlight(flightId: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id: flightId,
      },
      include: {
        origin: true,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return flight.origin;
  }

  async findDestinationAirportByFlight(flightId: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id: flightId,
      },
      include: {
        destination: true,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return flight.destination;
  }

  async create(createFlightDto: CreateFlightDto) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id: createFlightDto.airlineId,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id: createFlightDto.aircraftId,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    const originAirport = await this.prisma.airport.findUnique({
      where: {
        id: createFlightDto.originAirportId,
      },
    });

    if (!originAirport) {
      throw new RpcHttpException(404, 'Origin airport not found');
    }

    const destinationAirport = await this.prisma.airport.findUnique({
      where: {
        id: createFlightDto.destinationAirportId,
      },
    });

    if (!destinationAirport) {
      throw new RpcHttpException(404, 'Destination airport not found');
    }

    if (
      createFlightDto.originAirportId === createFlightDto.destinationAirportId
    ) {
      throw new RpcHttpException(
        400,
        'Origin and destination airports cannot be the same',
      );
    }

    const departureTime = new Date(createFlightDto.departureTime);
    const arrivalTime = new Date(createFlightDto.arrivalTime);

    if (arrivalTime <= departureTime) {
      throw new RpcHttpException(
        400,
        'Arrival time must be after departure time',
      );
    }

    const flightNumber = createFlightDto.flightNumber.toUpperCase();

    const exists = await this.prisma.flight.findFirst({
      where: {
        flightNumber,
        departureTime,
      },
    });

    if (exists) {
      throw new RpcHttpException(409, 'Flight already exists');
    }

    const flight = await this.prisma.flight.create({
      data: {
        ...createFlightDto,
        flightNumber,
        departureTime,
        arrivalTime,
      },
      include: {
        aircraft: true,
      },
    });

    const eventData = {
      flightId: flight.id,
      aircraftModelId: flight.aircraft.modelId,
    };

    console.log('========== FLIGHT CREATED EVENT ==========');
    console.log(eventData);

    this.kafkaClient.emit('flight.created', eventData);

    return new DataResponse('Flight created successfully', 200);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [flights, total] = await Promise.all([
      this.prisma.flight.findMany({
        skip,
        take: limit,
        include: {
          airline: true,
          aircraft: true,
          origin: true,
          destination: true,
        },
      }),

      this.prisma.flight.count(),
    ]);

    return new DataResponse<{
      flights: Flight[];
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get flights successfully', 200, {
      flights,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id,
      },
      include: {
        airline: true,
        aircraft: true,
        origin: true,
        destination: true,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return new DataResponse<Partial<Flight>>(
      'Selected flight successfully',
      200,
      flight,
    );
  }

  async update(id: string, updateFlightDto: UpdateFlightDto) {
    const flight = await this.getFlightById(id);

    await this.validateAirline(updateFlightDto.airlineId);
    await this.validateAircraft(updateFlightDto.aircraftId);
    await this.validateAirport(
      updateFlightDto.originAirportId,
      'Origin airport not found',
    );
    await this.validateAirport(
      updateFlightDto.destinationAirportId,
      'Destination airport not found',
    );

    const originAirportId =
      updateFlightDto.originAirportId ?? flight.originAirportId;
    const destinationAirportId =
      updateFlightDto.destinationAirportId ?? flight.destinationAirportId;

    this.ensureDifferentAirports(originAirportId, destinationAirportId);

    const departureTime = this.toDate(
      updateFlightDto.departureTime,
      flight.departureTime,
    );
    const arrivalTime = this.toDate(
      updateFlightDto.arrivalTime,
      flight.arrivalTime,
    );

    this.ensureValidFlightTimes(departureTime, arrivalTime);

    if (updateFlightDto.flightNumber) {
      updateFlightDto.flightNumber = updateFlightDto.flightNumber.toUpperCase();
      await this.ensureFlightNumberAvailable(
        updateFlightDto.flightNumber,
        departureTime,
        id,
      );
    }

    await this.prisma.flight.update({
      where: {
        id,
      },
      data: {
        ...updateFlightDto,
        departureTime,
        arrivalTime,
      },
    });

    return new DataResponse('Flight updated successfully', 200);
  }

  private async getFlightById(id: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    return flight;
  }

  private async validateAirline(airlineId?: string) {
    if (!airlineId) {
      return;
    }

    const airline = await this.prisma.airline.findUnique({
      where: {
        id: airlineId,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }
  }

  private async validateAircraft(aircraftId?: string) {
    if (!aircraftId) {
      return;
    }

    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id: aircraftId,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }
  }

  private async validateAirport(
    airportId?: string,
    notFoundMessage = 'Airport not found',
  ) {
    if (!airportId) {
      return;
    }

    const airport = await this.prisma.airport.findUnique({
      where: {
        id: airportId,
      },
    });

    if (!airport) {
      throw new RpcHttpException(404, notFoundMessage);
    }
  }

  private ensureDifferentAirports(
    originAirportId: string,
    destinationAirportId: string,
  ) {
    if (originAirportId === destinationAirportId) {
      throw new RpcHttpException(
        400,
        'Origin and destination airports cannot be the same',
      );
    }
  }

  private toDate(value: string | undefined, fallback: Date) {
    return value ? new Date(value) : fallback;
  }

  private ensureValidFlightTimes(departureTime: Date, arrivalTime: Date) {
    if (arrivalTime <= departureTime) {
      throw new RpcHttpException(
        400,
        'Arrival time must be after departure time',
      );
    }
  }

  private async ensureFlightNumberAvailable(
    flightNumber: string,
    departureTime: Date,
    id: string,
  ) {
    const exists = await this.prisma.flight.findFirst({
      where: {
        flightNumber,
        departureTime,
        NOT: {
          id,
        },
      },
    });

    if (exists) {
      throw new RpcHttpException(409, 'Flight already exists');
    }
  }

  async remove(id: string) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    await this.prisma.flight.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Flight deleted successfully', 200);
  }

  async changeStatus(changeStatusDto: ChangeStatusDto) {
    const flight = await this.prisma.flight.findUnique({
      where: {
        id: changeStatusDto.flightId,
      },
    });

    if (!flight) {
      throw new RpcHttpException(404, 'Flight not found');
    }

    if (flight.status === changeStatusDto.status) {
      throw new RpcHttpException(400, `Flight is already ${flight.status}`);
    }

    const allowedTransitions: Record<FlightStatus, FlightStatus[]> = {
      [FlightStatus.SCHEDULED]: [
        FlightStatus.BOARDING,
        FlightStatus.DELAYED,
        FlightStatus.CANCELLED,
      ],

      [FlightStatus.BOARDING]: [
        FlightStatus.DEPARTED,
        FlightStatus.DELAYED,
        FlightStatus.CANCELLED,
      ],

      [FlightStatus.DELAYED]: [
        FlightStatus.BOARDING,
        FlightStatus.DEPARTED,
        FlightStatus.CANCELLED,
      ],

      [FlightStatus.DEPARTED]: [FlightStatus.ARRIVED],

      [FlightStatus.ARRIVED]: [],

      [FlightStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[flight.status].includes(changeStatusDto.status)) {
      throw new RpcHttpException(
        400,
        `Cannot change status from ${flight.status} to ${changeStatusDto.status}`,
      );
    }

    await this.prisma.flight.update({
      where: {
        id: flight.id,
      },
      data: {
        status: changeStatusDto.status,
      },
    });

    return new DataResponse('Flight status updated successfully', 200);
  }
}
