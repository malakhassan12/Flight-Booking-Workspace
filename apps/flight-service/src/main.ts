import { bootstrapMicroservice } from '@flight-booking-workspace/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { FlightModule } from './app/flight.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(FlightModule);

  const configService = context.get(ConfigService);
  console.log('From Flight-service', configService.get<number>('PORT'));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FlightModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>('FLIGHT_CLIENT_ID') || '',

          brokers: [configService.get<string>('KAFKA_BROKER') || ''],
        },
        consumer: {
          groupId: configService.get<string>('FLIGHT_GROUP_ID') || '',
        },
      },
    },
  );

  bootstrapMicroservice(app);

  await app.listen();
}

bootstrap();
