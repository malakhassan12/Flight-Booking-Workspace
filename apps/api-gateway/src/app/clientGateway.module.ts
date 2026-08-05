import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientGatewayService } from './clientGateway.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'USER_SERVICE',
        useFactory: async (configService: ConfigService) => {
          console.log('USER_SERVICE', {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USER_SERVICE_PORT'),
          });

          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('USER_SERVICE_HOST'),
              port: Number(configService.get('USER_SERVICE_PORT')),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'AUTH_SERVICE',
        useFactory: async (config: ConfigService) => {
          console.log('AUTH CONFIG', {
            host: config.get('AUTH_SERVICE_HOST'),
            port: config.get('AUTH_SERVICE_PORT'),
          });

          return {
            transport: Transport.TCP,
            options: {
              host: config.get('AUTH_SERVICE_HOST'),
              port: Number(config.get('AUTH_SERVICE_PORT')),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'FLIGHT_SERVICE',
        useFactory: async (config: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: config.get<string>('APIGATEWAY_CLIENT_ID') || '',
                brokers: [config.get<string>('KAFKA_BROKER') || ''],
              },
              consumer: {
                groupId: config.get<string>('APIGATEWAY_GROUP_ID') || '',
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
  providers: [ClientGatewayService],
})
export class ClientGatewayModule {}
