import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DataResponse,
  RpcHttpException,
  CreateAirlineDto,
  UpdateAirlineDto,
} from '@flight-booking-workspace/common';
import { Airline } from '../../generated/prisma/client';

@Injectable()
export class AirlineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAirlineDto: CreateAirlineDto) {
    const country = await this.prisma.country.findUnique({
      where: {
        id: createAirlineDto.countryId,
      },
    });

    if (!country) {
      throw new RpcHttpException(404, 'Country not found');
    }

    const code = createAirlineDto.code.toUpperCase();

    const airline = await this.prisma.airline.findFirst({
      where: {
        OR: [
          {
            name: createAirlineDto.name,
          },
          {
            code,
          },
        ],
      },
    });

    if (airline) {
      throw new RpcHttpException(
        409,
        'Airline with this name or code already exists',
      );
    }

    await this.prisma.airline.create({
      data: {
        ...createAirlineDto,
        code,
      },
    });

    return new DataResponse('Airline created successfully', 200);
  }
  async findCountryByAirlineId(id: string) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id,
      },
      include: {
        country: true,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    return airline.country;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [airlines, total] = await Promise.all([
      this.prisma.airline.findMany({
        skip,
        take: limit,
        include: {
          country: true,
        },
      }),

      this.prisma.airline.count(),
    ]);

    return new DataResponse<{
      airlines: Airline[];
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get airlines successfully', 200, {
      airlines,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findByAirlineId(airlineId: string) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id: airlineId,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    const flights = await this.prisma.flight.findMany({
      where: {
        airlineId,
      },
    });

    return flights;
  }

  async findOne(id: string) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id,
      },
      include: {
        country: true,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    return new DataResponse<Partial<Airline>>(
      'Selected airline successfully',
      200,
      airline,
    );
  }

  async update(id: string, updateAirlineDto: UpdateAirlineDto) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    if (updateAirlineDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: {
          id: updateAirlineDto.countryId,
        },
      });

      if (!country) {
        throw new RpcHttpException(404, 'Country not found');
      }
    }

    if (updateAirlineDto.code) {
      updateAirlineDto.code = updateAirlineDto.code.toUpperCase();

      const exists = await this.prisma.airline.findFirst({
        where: {
          code: updateAirlineDto.code,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new RpcHttpException(409, 'Airline code already exists');
      }
    }

    if (updateAirlineDto.name) {
      const exists = await this.prisma.airline.findFirst({
        where: {
          name: updateAirlineDto.name,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new RpcHttpException(409, 'Airline name already exists');
      }
    }

    await this.prisma.airline.update({
      where: {
        id,
      },
      data: updateAirlineDto,
    });

    return new DataResponse('Airline updated successfully', 200);
  }

  async remove(id: string) {
    const airline = await this.prisma.airline.findUnique({
      where: {
        id,
      },
    });

    if (!airline) {
      throw new RpcHttpException(404, 'Airline not found');
    }

    await this.prisma.airline.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Airline deleted successfully', 200);
  }
}
