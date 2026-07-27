import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  DataResponse,
  Role,
  UserPayload,
  RpcHttpException,
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
    try {
      return await lastValueFrom(
        this.userClient.send({ cmd: 'create-user' }, data).pipe(
          catchError((err) => {
            console.log('Sign-up');
            console.dir(err, { depth: null });

            return throwError(() => err);
          }),
        ),
      );
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
    type: 'save' | 'update',
  ) {
    try {
      const hashed = await bcrypt.hash(refreshToken, 10);

      const expiresAt = new Date();

      expiresAt.setDate(expiresAt.getDate() + 30);

      await lastValueFrom(
        this.userClient
          .send(
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
          )
          .pipe(
            catchError((err) => {
              return throwError(() => err);
            }),
          ),
      );
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }
  async login(data: LoginDto) {
    try {
      const user = await lastValueFrom(
        this.userClient.send({ cmd: 'validate-user' }, data).pipe(
          catchError((err) => {
            console.log('Validate auth-service');
            console.dir(err, { depth: null });

            return throwError(() => err);
          }),
        ),
      );

      console.log('USER =>', user);

      const genToken = await this.generateTokens(user);

      await this.persistRefreshToken(user.id, genToken.refreshToken, 'save');

      return {
        data: {
          refreshToken: genToken.refreshToken,
          accessToken: genToken.accessToken,
        },
      };
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }

  async resetPassword(data: ResetPasswordDto, user: UserPayload) {
    try {
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
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }

  async generateTokens(user: { id: string; email: string; role: Role }) {
    try {
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
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await firstValueFrom(
        this.userClient
          .send(
            { cmd: 'verify-refresh-token' },
            {
              userId: payload.id,
              refreshToken,
            },
          )
          .pipe(
            catchError((err) => {
              console.log('Refresh auth-service');
              console.dir(err, { depth: null });

              return throwError(() => err);
            }),
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
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }

  async logout(user: UserPayload, refreshToken: string) {
    try {
      return await firstValueFrom(
        this.userClient
          .send(
            { cmd: 'delete-refresh-token' },
            {
              userId: user.id,
              refreshToken,
            },
          )
          .pipe(
            catchError((err) => {
              console.log('logout auth-service');
              console.dir(err, { depth: null });

              return throwError(() => err);
            }),
          ),
      );
    } catch (e: any) {
      throw new RpcHttpException(
        e?.statusCode ?? 500,
        e?.message ?? 'Internal server error',
      );
    }
  }
}
