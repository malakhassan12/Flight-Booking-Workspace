/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { UserModule } from './app/user.module';
// import { bootstrapHttp } from '@flight-booking-workspace/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const app = await NestFactory.create(UserModule);
  console.log('From Auth-service', process.env.PORT);

  const context = await NestFactory.createApplicationContext(UserModule);

  const configService = context.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        port: configService.get<number>('PORT', 3002),
      },
    },
  );

  // await bootstrapHttp(app, {
  //   port: Number(process.env.PORT) || 3001,
  //   prefix: 'api',
  //   swagger: true,
  // });
  await app.listen();
}

bootstrap();
