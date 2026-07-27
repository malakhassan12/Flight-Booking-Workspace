import { Injectable, UnauthorizedException } from '@nestjs/common';

import type {
  DeleteRefreshToken,
  SaveRefreshToken,
  UpdateRefreshToken,
  VerifyRefreshToken,
} from '@flight-booking-workspace/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  private async findToken(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    for (const token of tokens) {
      const match = await bcrypt.compare(refreshToken, token.tokenHash);

      if (match) {
        return token;
      }
    }
    throw new UnauthorizedException('Invalid refresh token');
  }

  async saveRefreshToken(data: SaveRefreshToken) {
    return this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async verifyRefreshToken(data: VerifyRefreshToken) {
    const token = await this.findToken(data.userId, data.refreshToken);
    return token.user;
  }

  async updateRefreshToken(data: UpdateRefreshToken) {
    const token = await this.findToken(data.userId, data.refreshToken);

    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: {
          id: token.id,
        },
        data: {
          revoked: true,
        },
      });

      await tx.refreshToken.create({
        data: {
          userId: data.userId,
          tokenHash: data.refreshTokenHash,
          expiresAt: data.expiresAt,
        },
      });
    });

    return true;
  }

  async deleteRefreshToken(data: DeleteRefreshToken) {
    const token = await this.findToken(data.userId, data.refreshToken);
    return await this.prisma.refreshToken.delete({
      where: {
        id: token.id,
      },
    });
  }
}
