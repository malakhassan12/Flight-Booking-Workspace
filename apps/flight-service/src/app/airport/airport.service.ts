import { Injectable } from '@nestjs/common';
import {
  CreateAirportDto,
  UpdateAirportDto,
  RpcHttpException,
  DataResponse,
} from '@flight-booking-workspace/common';

import { PrismaService } from '../prisma/prisma.service';
import { Airport } from '../../generated/prisma/client';

@Injectable()
export class AirportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAirportDto: CreateAirportDto) {
    const city = await this.prisma.city.findUnique({
      where: {
        id: createAirportDto.cityId,
      },
    });

    if (!city) {
      throw new RpcHttpException(404, 'City not found');
    }

    const iataCode = createAirportDto.iataCode.toUpperCase();
    const icaoCode = createAirportDto.icaoCode.toUpperCase();

    const airport = await this.prisma.airport.findFirst({
      where: {
        OR: [
          {
            iataCode,
          },
          {
            icaoCode,
          },
        ],
      },
    });

    if (airport) {
      throw new RpcHttpException(
        409,
        'Airport with this IATA or ICAO code already exists',
      );
    }
    await this.prisma.airport.create({
      data: {
        ...createAirportDto,
        iataCode,
        icaoCode,
      },
    });

    return new DataResponse('Airport created successfully', 200);
  }
  
  async FindCityByAirport(id: string) {
    const airport = await this.prisma.airport.findUnique({
      where: {
        id,
      },
      include: {
        city: true,
      },
    });

    if (!airport) {
      throw new RpcHttpException(404, 'Airport not found');
    }

    return airport.city;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [airports, total] = await Promise.all([
      this.prisma.airport.findMany({
        skip,
        take: limit,
        include: {
          city: true,
        },
      }),

      this.prisma.airport.count({}),
    ]);

    return new DataResponse<{
      airports: Airport[];
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get airports successfully', 200, {
      airports: airports,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const airport = await this.prisma.airport.findUnique({
      where: {
        id,
      },
      include: {
        city: true,
      },
    });

    if (!airport) {
      throw new RpcHttpException(404, 'Airport not found');
    }

    return new DataResponse<Partial<Airport>>(
      'Selected airport successfully',
      200,
      airport,
    );
  }

  async update(id: string, updateAirportDto: UpdateAirportDto) {
    const airport = await this.prisma.airport.findUnique({
      where: {
        id,
      },
    });

    if (!airport) {
      throw new RpcHttpException(404, 'Airport not found');
    }

    if (updateAirportDto.cityId) {
      const city = await this.prisma.city.findUnique({
        where: {
          id: updateAirportDto.cityId,
        },
      });

      if (!city) {
        throw new RpcHttpException(404, 'City not found');
      }
    }

    if (updateAirportDto.iataCode) {
      updateAirportDto.iataCode = updateAirportDto.iataCode.toUpperCase();
    }

    if (updateAirportDto.icaoCode) {
      updateAirportDto.icaoCode = updateAirportDto.icaoCode.toUpperCase();
    }

    await this.prisma.airport.update({
      where: {
        id,
      },
      data: updateAirportDto,
    });
    return new DataResponse('Airport updated successfully', 200);
  }

  async remove(id: string) {
    const airport = await this.prisma.airport.findUnique({
      where: {
        id,
      },
    });

    if (!airport) {
      throw new RpcHttpException(404, 'Airport not found');
    }

    await this.prisma.airport.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Airport deleted successfully', 200);
  }
}
