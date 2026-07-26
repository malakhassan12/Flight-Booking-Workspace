import { Module } from '@nestjs/common';
import { APIGatewayController } from './api-gateway.controller';
import { APIGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'USER_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USER_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'AUTH_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [APIGatewayController],
  providers: [APIGatewayService],
})
export class APIGatewayModule {}
