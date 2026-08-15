/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { SeatModule } from './app/seat.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsulService } from '@flight-booking-workspace/consul';

async function bootstrap() {
  const app = await NestFactory.create(SeatModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3004;

  const consulService = app.get(ConsulService);

  const clientId = await consulService.getValue('seat-service/SEAT_CLIENT_ID');

  const broker = await consulService.getValue('api-gateway/kafka/broker');

  const groupId = await consulService.getValue('seat-service/SEAT_GROUP_ID');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: String(clientId),
        brokers: [String(broker)],
      },
      consumer: {
        groupId: String(groupId),
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(port);
}

bootstrap();
