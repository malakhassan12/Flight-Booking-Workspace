import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class AuthService {
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
