/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { bootstrapMicroservice } from '@flight-booking-workspace/core';


async function bootstrap() {
  const context = await NestFactory.createApplicationContext(UserModule);

  const configService = context.get(ConfigService);
  console.log('From user-service', configService.get<number>('PORT'));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: configService.get<number>('PORT', 3001),
      },
    },
  );
  bootstrapMicroservice(app);

  await app.listen();
}

bootstrap();
