import { NestFactory } from '@nestjs/core';
import { BookingModule } from './app/booking.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3004;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>('BOOKING_CLIENT_ID') || '',

        brokers: [configService.get<string>('KAFKA_BROKER') || ''],
      },
      consumer: {
        groupId: configService.get<string>('BOOKING_GROUP_ID') || '',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(port);
}

bootstrap();
