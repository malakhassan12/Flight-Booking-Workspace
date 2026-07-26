import {
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  DataResponse,
  Role,
  UserPayload,
} from '@flight-booking-workspace/common';
import {
  LoginDto,
  SignUpDto,
  ResetPasswordDto,
} from '@flight-booking-workspace/security';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(data: SignUpDto) {
    return this.userClient.send({ cmd: 'create-user' }, data);
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
    type: 'save' | 'update',
  ) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    await lastValueFrom(
      this.userClient.send(
        { cmd: `${type}-refresh-token` },
        type === 'update'
          ? {
              userId: userId,
              refreshTokenHash: hashed,
              expiresAt,
              refreshToken,
            }
          : {
              userId,
              refreshTokenHash: hashed,
              expiresAt,
            },
      ),
    );
  }

  async login(data: LoginDto) {
    const user = await lastValueFrom(
      this.userClient.send({ cmd: 'validate-user' }, data),
    );

    const genToken = await this.generateTokens(user);

    await this.persistRefreshToken(user.id, genToken.refreshToken, 'save');

    return {
      data: {
        refreshToken: genToken.refreshToken,
        accessToken: genToken.accessToken,
      },
    };
  }

  async resetPassword(data: ResetPasswordDto, user: UserPayload) {
    await lastValueFrom(
      this.userClient.send(
        { cmd: 'check-password' },
        {
          id: user.id,
          password: data.oldPassword,
        },
      ),
    );

    await lastValueFrom(
      this.userClient.send(
        { cmd: 'reset-password' },
        {
          id: user.id,
          password: data.newPassword,
        },
      ),
    );

    return new DataResponse('Reset Password Successfully', HttpStatus.OK);
  }

  async generateTokens(user: { id: string; email: string; role: Role }) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await firstValueFrom(
        this.userClient.send(
          { cmd: 'verify-refresh-token' },
          {
            userId: payload.id,
            refreshToken,
          },
        ),
      );

      const genToken = await this.generateTokens(user);

      await this.persistRefreshToken(user.id, genToken.refreshToken, 'update');

      return {
        data: {
          refreshToken: genToken.refreshToken,
          accessToken: genToken.accessToken,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(user: UserPayload, refreshToken: string) {
    await firstValueFrom(
      this.userClient.send(
        { cmd: 'delete-refresh-token' },
        {
          userId: user.id,
          refreshToken,
        },
      ),
    );
  }
}
