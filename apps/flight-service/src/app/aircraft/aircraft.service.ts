import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DataResponse,
  RpcHttpException,
} from '@flight-booking-workspace/common';
import {
  CreateAircraftDto,
  UpdateAircraftDto,
} from '@flight-booking-workspace/common';
import { Aircraft } from '../../generated/prisma/client';

@Injectable()
export class AircraftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAircraftDto: CreateAircraftDto) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id: createAircraftDto.manufacturerId,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    const model = await this.prisma.aircraftModel.findUnique({
      where: {
        id: createAircraftDto.modelId,
      },
    });

    if (!model) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    if (model.manufacturerId !== createAircraftDto.manufacturerId) {
      throw new RpcHttpException(
        400,
        'Aircraft model does not belong to the selected manufacturer',
      );
    }

    const registrationNumber =
      createAircraftDto.registrationNumber.toUpperCase();

    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        registrationNumber,
      },
    });

    if (aircraft) {
      throw new RpcHttpException(
        409,
        'Aircraft with this registration number already exists',
      );
    }

    await this.prisma.aircraft.create({
      data: {
        ...createAircraftDto,
        registrationNumber,
      },
    });

    return new DataResponse('Aircraft created successfully', 200);
  }

  async findAircarftModelByAircraft(id: string) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id,
      },
      include: {
        model: true
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    return aircraft.model;
  }

  async findManufacturerByAircraft(id: string) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id,
      },
      include: {
        manufacturer:true
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    return aircraft.manufacturer;
  }

  async findFlightsByAircraft(aircraftId: string) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id: aircraftId,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }
    return await this.prisma.flight.findMany({
      where: {
        aircraftId,
      },
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [aircraftList, total] = await Promise.all([
      this.prisma.aircraft.findMany({
        skip,
        take: limit,
        include: {
          manufacturer: true,
          model: true,
        },
      }),

      this.prisma.aircraft.count(),
    ]);

    return new DataResponse<{
      aircraftList: Aircraft[];
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get aircraft successfully', 200, {
      aircraftList,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id,
      },
      include: {
        manufacturer: true,
        model: true,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    return new DataResponse<Partial<Aircraft>>(
      'Selected aircraft successfully',
      200,
      aircraft,
    );
  }

  async update(id: string, updateAircraftDto: UpdateAircraftDto) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    const manufacturerId =
      updateAircraftDto.manufacturerId ?? aircraft.manufacturerId;

    const modelId = updateAircraftDto.modelId ?? aircraft.modelId;

    if (updateAircraftDto.manufacturerId) {
      const manufacturer = await this.prisma.manufacturer.findUnique({
        where: {
          id: manufacturerId,
        },
      });

      if (!manufacturer) {
        throw new RpcHttpException(404, 'Manufacturer not found');
      }
    }

    if (updateAircraftDto.modelId) {
      const model = await this.prisma.aircraftModel.findUnique({
        where: {
          id: modelId,
        },
      });

      if (!model) {
        throw new RpcHttpException(404, 'Aircraft model not found');
      }

      if (model.manufacturerId !== manufacturerId) {
        throw new RpcHttpException(
          400,
          'Aircraft model does not belong to the selected manufacturer',
        );
      }
    }

    if (updateAircraftDto.registrationNumber) {
      updateAircraftDto.registrationNumber =
        updateAircraftDto.registrationNumber.toUpperCase();

      const exists = await this.prisma.aircraft.findFirst({
        where: {
          registrationNumber: updateAircraftDto.registrationNumber,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new RpcHttpException(
          409,
          'Aircraft with this registration number already exists',
        );
      }
    }

    await this.prisma.aircraft.update({
      where: {
        id,
      },
      data: updateAircraftDto,
    });

    return new DataResponse('Aircraft updated successfully', 200);
  }

  async remove(id: string) {
    const aircraft = await this.prisma.aircraft.findUnique({
      where: {
        id,
      },
    });

    if (!aircraft) {
      throw new RpcHttpException(404, 'Aircraft not found');
    }

    await this.prisma.aircraft.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Aircraft deleted successfully', 200);
  }
}
