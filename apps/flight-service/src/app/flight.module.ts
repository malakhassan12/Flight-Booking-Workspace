import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { CoreModule } from '@flight-booking-workspace/core';
import { SecurityModule } from '@flight-booking-workspace/security';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { AircraftModelModule } from './aircraftModel/aircraft-model.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConsulModule, ConsulService } from '@flight-booking-workspace/consul';
import { VaultModule } from '@flight-booking-workspace/vault';
import { AircraftLayoutModule } from './aircraftLayout/aircraft-layout.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    VaultModule,
    ConsulModule,
    SecurityModule,
    CoreModule,
    PrismaModule,
    AirlineModule,
    AirportModule,
    AircraftModule,
    AircraftModelModule,
    AircraftLayoutModule,
    ManufacturerModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConsulModule],
        useFactory: async (consulService: ConsulService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId:
                (await consulService.getValue(
                  'flight-service/FLIGHT_CLIENT_ID',
                )) || '',
              brokers: [
                (await consulService.getValue('api-gateway/kafka/broker')) ||
                  '',
              ],
            },
            producer: {},
          },
        }),
        inject: [ConsulService],
      },
    ]),
  ],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
