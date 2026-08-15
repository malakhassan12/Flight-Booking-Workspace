import { Injectable, OnModuleInit } from '@nestjs/common';
import { Response } from 'express';
import { ConsulService } from '@flight-booking-workspace/consul';

@Injectable()
export class APIGatewayService implements OnModuleInit {
  constructor(private readonly consulService: ConsulService) {}
  async onModuleInit() {
    await this.consulService.createIntention(
      'api-gateway',
      'user-service',
      'allow',
    );

    await this.consulService.createIntention(
      'api-gateway',
      'auth-service',
      'allow',
    );

    await this.consulService.createIntention(
      'api-gateway',
      'flight-service',
      'allow',
    );
  }
  setRefreshCookie(response: Response, refreshToken: string) {
    response.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  clearRefreshCookie(response: Response) {
    response.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
