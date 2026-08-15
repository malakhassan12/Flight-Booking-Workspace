import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAircraftLayoutDto,
  UpdateAircarftLayoutDto,
  DataResponse,
  RpcHttpException,
} from '@flight-booking-workspace/common';
import { AircraftLayout } from '../../generated/prisma/client';

@Injectable()
export class AircraftLayoutService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAircraftLayoutDto) {
    const { aircraftModelId, rows, seatsPerRow } = createDto;

    // 1. Check Aircraft Model
    const aircraftModel = await this.prisma.aircraftModel.findUnique({
      where: {
        id: aircraftModelId,
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(404, 'Aircraft model not found');
    }

    // 2. Check if layout already exists
    const existingLayout = await this.prisma.aircraftLayout.findUnique({
      where: {
        aircraftModelId,
      },
    });

    if (existingLayout) {
      throw new RpcHttpException(409, 'Aircraft model already has a layout');
    }

    // 3. Create layout
    await this.prisma.aircraftLayout.create({
      data: {
        aircraftModelId,
        rows,
        seatsPerRow,
      },
    });

    return new DataResponse('Aircraft layout created successfully', 201);
  }

  async findOne(id: string) {
    const layout = await this.prisma.aircraftLayout.findUnique({
      where: {
        id,
      },
      include: {
        aircraftModel: true,
      },
    });

    if (!layout) {
      throw new RpcHttpException(404, 'Aircraft layout not found');
    }

    return new DataResponse<AircraftLayout>(
      'Aircraft layout retrieved successfully',
      200,
      layout,
    );
  }

  async findByAircraftModel(aircraftModelId: string) {
    const layout = await this.prisma.aircraftLayout.findUnique({
      where: {
        aircraftModelId,
      },
      include: {
        aircraftModel: true,
      },
    });

    if (!layout) {
      throw new RpcHttpException(
        404,
        'Aircraft layout not found for this aircraft model',
      );
    }

    return layout;
  }

  async findByAircraftLayout(aircraftLayoutId: string) {
    const aircraftModel = await this.prisma.aircraftModel.findFirst({
      where: {
        layout: {
          id: aircraftLayoutId,
        },
      },
    });

    if (!aircraftModel) {
      throw new RpcHttpException(
        404,
        'Aircraft model not found for this aircraft layout',
      );
    }

    return aircraftModel;
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [aircraftLayouts, total] = await Promise.all([
      this.prisma.aircraftLayout.findMany({
        skip,
        take: limit,
        include: {
          aircraftModel: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.aircraftLayout.count(),
    ]);

    return new DataResponse<{
      aircraftLayouts: AircraftLayout[];

      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }>('Get aircraft layouts successfully', 200, {
      aircraftLayouts,

      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async update(updateDto: UpdateAircarftLayoutDto) {
    // 1. Check layout
    const existingLayout = await this.prisma.aircraftLayout.findUnique({
      where: {
        id: updateDto.id,
      },
    });

    if (!existingLayout) {
      throw new RpcHttpException(404, 'Aircraft layout not found');
    }

    // 2. Update
    await this.prisma.aircraftLayout.update({
      where: {
        id: updateDto.id,
      },
      data: {
        ...updateDto,
      },
    });

    return new DataResponse('Aircraft layout updated successfully', 200);
  }

  async remove(id: string) {
    const existingLayout = await this.prisma.aircraftLayout.findUnique({
      where: {
        id,
      },
    });

    if (!existingLayout) {
      throw new RpcHttpException(404, 'Aircraft layout not found');
    }

    await this.prisma.aircraftLayout.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Aircraft layout deleted successfully', 200);
  }
}
