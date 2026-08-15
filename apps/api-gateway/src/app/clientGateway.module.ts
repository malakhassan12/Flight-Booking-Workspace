import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientGatewayService } from './clientGateway.service';
// import { ConsulModule } from './consul/consul.module';
// import { ConsulService } from './consul/consul.service';

import { ConsulService, ConsulModule } from '@flight-booking-workspace/consul';
import { SeatClientService } from './seat/seatClient.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      // {
      //   imports: [ConfigModule],
      //   name: 'USER_SERVICE',
      //   useFactory: async (configService: ConfigService) => {
      //     console.log('USER_SERVICE', {
      //       host: configService.get('USER_SERVICE_HOST'),
      //       port: configService.get('USER_SERVICE_PORT'),
      //     });

      //     return {
      //       transport: Transport.TCP,
      //       options: {
      //         host: configService.get('USER_SERVICE_HOST'),
      //         port: Number(configService.get('USER_SERVICE_PORT')),
      //       },
      //     };
      //   },
      //   inject: [ConfigService],
      // },

      {
        name: 'USER_SERVICE',

        imports: [ConsulModule],

        useFactory: async (consulService: ConsulService) => {
          const { host, port } = await consulService.discover('user-service');

          console.log('USER SERVICE DISCOVERED:', {
            host,
            port,
          });

          return {
            transport: Transport.TCP,

            options: {
              host,
              port,
            },
          };
        },

        inject: [ConsulService],
      },

      // {
      //   imports: [ConfigModule],
      //   name: 'AUTH_SERVICE',
      //   useFactory: async (config: ConfigService) => {
      //     console.log('AUTH CONFIG', {
      //       host: config.get('AUTH_SERVICE_HOST'),
      //       port: config.get('AUTH_SERVICE_PORT'),
      //     });

      //     return {
      //       transport: Transport.TCP,
      //       options: {
      //         host: config.get('AUTH_SERVICE_HOST'),
      //         port: Number(config.get('AUTH_SERVICE_PORT')),
      //       },
      //     };
      //   },
      //   inject: [ConfigService],
      // },

      {
        imports: [ConsulModule],
        name: 'AUTH_SERVICE',
        useFactory: async (consulService: ConsulService) => {
          const { host, port } = await consulService.discover('auth-service');

          console.log('AUTH SERVICE DISCOVERED:', {
            host,
            port,
          });

          return {
            transport: Transport.TCP,

            options: {
              host,
              port,
            },
          };
        },
        inject: [ConsulService],
      },

      // {
      //   imports: [ConfigModule],
      //   name: 'FLIGHT_SERVICE',
      //   useFactory: async (config: ConfigService) => {
      //     return {
      //       transport: Transport.KAFKA,
      //       options: {
      //         client: {
      //           clientId: config.get<string>('APIGATEWAY_CLIENT_ID') || '',
      //           brokers: [config.get<string>('KAFKA_BROKER') || ''],
      //         },
      //         consumer: {
      //           groupId: config.get<string>('APIGATEWAY_GROUP_ID') || '',
      //         },
      //       },
      //     };
      //   },
      //   inject: [ConfigService],
      // },

      {
        imports: [ConsulModule],
        name: 'FLIGHT_SERVICE',
        useFactory: async (consulService: ConsulService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId:
                  (await consulService.getValue(
                    'api-gateway/kafka/client-id',
                  )) || '',
                brokers: [
                  (await consulService.getValue('api-gateway/kafka/broker')) ||
                    '',
                ],
              },
              consumer: {
                groupId:
                  (await consulService.getValue(
                    'api-gateway/kafka/group-id',
                  )) || '',
              },
            },
          };
        },
        inject: [ConsulService],
      },

      {
        imports: [ConsulModule],
        name: 'SEAT_SERVICE',
        useFactory: async (consulService: ConsulService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId:
                  (await consulService.getValue(
                    'api-gateway/seat-service/client-id',
                  )) || '',
                brokers: [
                  (await consulService.getValue('api-gateway/kafka/broker')) ||
                    '',
                ],
              },
              consumer: {
                groupId:
                  (await consulService.getValue(
                    'api-gateway/seat-service/group-id',
                  )) || '',
              },
            },
          };
        },
        inject: [ConsulService],
      },
    ]),
  ],
  exports: [ClientsModule],
  providers: [ClientGatewayService , SeatClientService],
})
export class ClientGatewayModule {}
