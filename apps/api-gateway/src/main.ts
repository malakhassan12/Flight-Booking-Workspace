/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { APIGatewayModule } from './app/api-gateway.module';
import { bootstrapHttp } from '@flight-booking-workspace/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(APIGatewayModule);
  const configService = app.get(ConfigService);

  await bootstrapHttp(app, {
    port: configService.get<number>('PORT') || 3000,
    prefix: 'api',
    swagger: true,
  });
}

bootstrap();
