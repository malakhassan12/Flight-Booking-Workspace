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

@Module({
  imports: [
    SecurityModule,
    CoreModule,
    PrismaModule,
    AirlineModule,
    AirportModule,
    AircraftModule,
    AircraftModelModule,
    ManufacturerModule,
  ],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
