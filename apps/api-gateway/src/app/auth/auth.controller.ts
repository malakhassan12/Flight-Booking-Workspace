import {
  Controller,
  Inject,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  DataResponse,
  type UserPayload,
} from '@flight-booking-workspace/common';
import {
  Public,
  User,
  LoginDto,
  SignUpDto,
  ResetPasswordDto,
} from '@flight-booking-workspace/security';
import type { Response, Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto),
    );

    this.authService.setRefreshCookie(response, result.data.refreshToken);

    return new DataResponse(
      'Login Successfully',
      HttpStatus.OK,
      result.data.accessToken,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() SignUpDto: SignUpDto) {
    await firstValueFrom(this.authClient.send({ cmd: 'sign-up' }, SignUpDto));

    return new DataResponse('Signup Successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('reset-password')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
    @User()
    user: UserPayload,
  ) {
    await firstValueFrom(
      this.authClient.send(
        { cmd: 'reset-password' },
        { resetPasswordDto, user },
      ),
    );

    return new DataResponse('Reset Password Successfully', HttpStatus.OK);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh-token'];

    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'refresh-token' }, refreshToken),
    );

    this.authService.setRefreshCookie(response, result.data.refreshToken);

    return new DataResponse(
      'Refresh Token Successfully',
      HttpStatus.OK,
      result.data.accessToken,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
    @User() user: UserPayload,
  ) {
    const refreshToken = req.cookies['refresh-token'];

    await firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, { refreshToken, user }),
    );

    this.authService.clearRefreshCookie(res);

    return new DataResponse('Logout Successfully', HttpStatus.OK);
  }
}
