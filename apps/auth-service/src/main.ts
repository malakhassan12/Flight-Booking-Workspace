import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule);

  const configService = context.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: configService.get<number>('PORT', 3002),
      },
    },
  );

  await app.listen();
}

bootstrap();
