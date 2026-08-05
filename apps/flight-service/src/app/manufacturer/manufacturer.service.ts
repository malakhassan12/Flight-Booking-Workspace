import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DataResponse,
  RpcHttpException,
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from '@flight-booking-workspace/common';
import { Manufacturer } from '../../generated/prisma/client';

@Injectable()
export class ManufacturerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createManufacturerDto: CreateManufacturerDto) {
    if (createManufacturerDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: {
          id: createManufacturerDto.countryId,
        },
      });

      if (!country) {
        throw new RpcHttpException(404, 'Country not found');
      }
    }

    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        name: createManufacturerDto.name,
      },
    });

    if (manufacturer) {
      throw new RpcHttpException(
        409,
        'Manufacturer with this name already exists',
      );
    }

    await this.prisma.manufacturer.create({
      data: createManufacturerDto,
    });

    return new DataResponse('Manufacturer created successfully', 200);
  }

  async findCountryByManufacturerId(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
      include: {
        country: true,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    return manufacturer.country;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [manufacturers, total] = await Promise.all([
      this.prisma.manufacturer.findMany({
        skip,
        take: limit,
        include: {
          country: true,
        },
      }),

      this.prisma.manufacturer.count(),
    ]);

    return new DataResponse<{
      manufacturers: Manufacturer[];

      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get manufacturers successfully', 200, {
      manufacturers,

      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findAircraftModelsByManufacturerId(manufacturerId: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id: manufacturerId,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    const aircraftModels = await this.prisma.aircraftModel.findMany({
      where: {
        manufacturerId,
      },
    });

    return aircraftModels;
  }

  async findAircraftListByManufacturerId(manufacturerId: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id: manufacturerId,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    const aircraftList = await this.prisma.aircraft.findMany({
      where: {
        manufacturerId,
      },
    });

    return aircraftList;
  }

  async findOne(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
      include: {
        country: true,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    return new DataResponse<Partial<Manufacturer>>(
      'Selected manufacturer successfully',
      200,
      manufacturer,
    );
  }

  async update(id: string, updateManufacturerDto: UpdateManufacturerDto) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    if (updateManufacturerDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: {
          id: updateManufacturerDto.countryId,
        },
      });

      if (!country) {
        throw new RpcHttpException(404, 'Country not found');
      }
    }

    if (updateManufacturerDto.name) {
      const exists = await this.prisma.manufacturer.findFirst({
        where: {
          name: updateManufacturerDto.name,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new RpcHttpException(
          409,
          'Manufacturer with this name already exists',
        );
      }
    }

    await this.prisma.manufacturer.update({
      where: {
        id,
      },
      data: updateManufacturerDto,
    });

    return new DataResponse('Manufacturer updated successfully', 200);
  }

  async remove(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    await this.prisma.manufacturer.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Manufacturer deleted successfully', 200);
  }
}
