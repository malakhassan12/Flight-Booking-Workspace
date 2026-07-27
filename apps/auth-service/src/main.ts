import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { bootstrapMicroservice } from '@flight-booking-workspace/core';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule);

  const configService = context.get(ConfigService);
  console.log('From Auth-service', configService.get<number>('PORT'));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: configService.get<number>('PORT', 3002),
      },
    },
  );


  bootstrapMicroservice(app);

  await app.listen();
}

bootstrap();
