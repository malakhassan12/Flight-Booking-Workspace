import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  UpdateUserDto,
  DataResponse,
  RpcHttpException,
} from '@flight-booking-workspace/common';
import type { UserPayload } from '@flight-booking-workspace/common';
import { LoginDto, SignUpDto } from '@flight-booking-workspace/security';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  }

  async checkPassword(id: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new RpcHttpException(404, 'User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new RpcHttpException(401, 'Current password is incorrect');
    }

    return true;
  }

  async resetPassword(id: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hash,
      },
    });

    return true;
  }

  async validateUser(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new RpcHttpException(404, 'User not found');
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new RpcHttpException(401, 'Current password is incorrect');
    }

    return user;
  }

  async create(data: SignUpDto): Promise<DataResponse<User>> {
    if (await this.checkEmail(data.email)) {
      throw new RpcHttpException(409, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (!Object.values(Role).includes(data.role as Role)) {
      throw new RpcHttpException(400, 'Invalid role');
    }

    await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return new DataResponse('User created successfully', 200);
  }

  async update(updateUserDto: UpdateUserDto, user: UserPayload) {
    const id = user.id;

    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new RpcHttpException(404, 'User not found');
    }

    if (updateUserDto?.role) {
      throw new RpcHttpException(409, 'Not Allowed to update your role');
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });

      if (existingUser && existingUser.id !== id) {
        throw new RpcHttpException(409, 'Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        await bcrypt.genSalt(),
      );
    }

    await this.prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: updateUserDto,
    });

    return new DataResponse('User updated successfully', 200);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: {
          role: Role.PASSENGER,
        },
        select: {
          id : true,
          name: true,
          email: true,
          gender: true,
          age: true,
          phone: true,
          address: true,
        },
      }),
      this.prisma.user.count({
        where: {
          role: Role.PASSENGER,
        },
      }),
    ]);

    return new DataResponse<{
      users: Partial<User>[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
      };
    }>('Get users successfully', 200, {
      users,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        age: true,
        phone: true,
        address: true,
      },
    });

    if (!user) {
      throw new RpcHttpException(404, 'User not found');
    }

    return new DataResponse<Partial<User>>(
      'Selected User successfully',
      200,
      user,
    );
  }

  async remove(user: UserPayload) {
    const id = user.id;
    const userExist = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new RpcHttpException(404, 'User not found');
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return new DataResponse('Deleted User successfully', 200);
  }
}
