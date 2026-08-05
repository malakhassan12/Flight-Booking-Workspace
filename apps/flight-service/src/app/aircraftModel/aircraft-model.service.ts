import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAircraftModelDto,
  UpdateAircraftModelDto,
  DataResponse,
  RpcHttpException,
} from '@flight-booking-workspace/common';
import { AircraftModel } from '../../generated/prisma/client';

@Injectable()
export class AircraftModelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAircraftModelDto: CreateAircraftModelDto) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id: createAircraftModelDto.manufacturerId,
      },
    });

    if (!manufacturer) {
      throw new RpcHttpException(404, 'Manufacturer not found');
    }

    const aircraftModel = await this.prisma.aircraftModel.findFirst({
      where: {
        name: createAircraftModelDto.name,
        manufacturerId: createAircraftModelDto.manufacturerId,
      },
    });

    if (aircraftModel) {
      throw new RpcHttpException(
        409,
        'Aircraft model already exists for this manufacturer',
      );
    }

    await this.prisma.aircraftModel.create({
      data: createAircraftModelDto,
    });

    return new DataResponse('Aircraft model created successfully', 200);
  }

  async findManufacturerByModelId(modelId: string) {
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id: modelId,
      },
      include: {
        manufacturer: true,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }
    console.log(
      '========== MANUFACTURER with aircarftModel service ==========',
    );
    console.log(aircraftModel.manufacturer);
    return aircraftModel.manufacturer;
  }

  async findAircraftListByModelId(modelId: string) {
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id: modelId,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    return await this.prisma.aircraft.findMany({
      where: {
        modelId,
      },
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [aircraftModels, total] = await Promise.all([
      this.prisma.aircraftModel.findMany({
        skip,
        take: limit,
        include: {
          manufacturer: true,
        },
      }),

      this.prisma.aircraftModel.count(),
    ]);

    return new DataResponse<{
      aircraftModels: AircraftModel[];

      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get aircraft models successfully', 200, {
      aircraftModels,

      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id,
      },
      include: {
        manufacturer: true,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    return new DataResponse<Partial<AircraftModel>>(
      'Selected aircraft model successfully',
      200,
      aircraftModel,
    );
  }

  async update(id: string, updateAircraftModelDto: UpdateAircraftModelDto) {
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    const manufacturerId =
      updateAircraftModelDto.manufacturerId ?? aircraftModel.manufacturerId;

    if (updateAircraftModelDto.manufacturerId) {
      const manufacturer = await this.prisma.manufacturer.findUnique({
        where: {
          id: manufacturerId,
        },
      });

      if (!manufacturer) {
        throw new RpcHttpException(404, 'Manufacturer not found');
      }
    }

    const name = updateAircraftModelDto.name ?? aircraftModel.name;

    const exists = await this.prisma.aircraftModel.findFirst({
      where: {
        name,
        manufacturerId,
        NOT: {
          id,
        },
      },
    });

    if (exists) {
      throw new RpcHttpException(
        409,
        'Aircraft model already exists for this manufacturer',
      );
    }

    await this.prisma.aircraftModel.update({
      where: {
        id,
      },
      data: updateAircraftModelDto,
    });

    return new DataResponse('Aircraft model updated successfully', 200);
  }

  async remove(id: string) {
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    await this.prisma.aircraftModel.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Aircraft model deleted successfully', 200);
  }
}
