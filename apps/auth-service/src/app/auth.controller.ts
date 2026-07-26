import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResetPasswordDto,
  SignUpDto,
} from '@flight-booking-workspace/security';
import type { UserPayload } from '@flight-booking-workspace/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'logout' })
  logout(data: { user: UserPayload; refreshToken: string }) {
    return this.authService.logout(data.user, data.refreshToken);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'sign-up' })
  signUp(@Payload() SignUpDto: SignUpDto) {
    return this.authService.signUp(SignUpDto);
  }

  @MessagePattern({ cmd: 'reset-password' })
  resetPassword(
    @Payload()
    data: {
      resetPasswordDto: ResetPasswordDto;
      user: UserPayload;
    },
  ) {
    return this.authService.resetPassword(data.resetPasswordDto, data.user);
  }

  @MessagePattern({ cmd: 'refresh-token' })
  refresh(@Payload() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
