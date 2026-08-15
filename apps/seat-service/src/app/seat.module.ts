import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeormModule } from './typeorm/typeorm.module';
import { CoreModule } from '@flight-booking-workspace/core';
import { ConsulModule, ConsulService } from '@flight-booking-workspace/consul';
import { VaultModule } from '@flight-booking-workspace/vault';
import { SecurityModule } from '@flight-booking-workspace/security';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '@flight-booking-workspace/redis';

@Module({
  imports: [
    TypeormModule,
    VaultModule,
    ConsulModule,
    SecurityModule,
    CoreModule,
    RedisModule,
    ClientsModule.registerAsync([
      // {
      //   imports: [ConfigModule],
      //   name: 'FLIGHT_SERVICE',
      //   useFactory: async (config: ConfigService) => {
      //     return {
      //       transport: Transport.KAFKA,
      //       options: {
      //         client: {
      //           clientId: config.get<string>('SEAT_CLIENT_ID') || '',
      //           brokers: [config.get<string>('KAFKA_BROKER') || ''],
      //         },
      //         consumer: {
      //           groupId: config.get<string>('SEAT_GROUP_ID') || '',
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
          const clientId = await consulService.getValue(
            'seat-service/SEAT_CLIENT_ID',
          );

          const broker = await consulService.getValue(
            'api-gateway/kafka/broker',
          );

          const groupId = await consulService.getValue(
            'seat-service/SEAT_GROUP_ID',
          );

          console.log('========== KAFKA CONFIG ==========');
          console.log('CLIENT_ID:', clientId);
          console.log('BROKER:', broker);
          console.log('BROKER TYPE:', typeof broker);
          console.log('BROKERS:', [String(broker)]);
          console.log('GROUP_ID:', groupId);
          console.log('===================================');

          return {
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
          };
        },
        inject: [ConsulService],
      },
    ]),
  ],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
