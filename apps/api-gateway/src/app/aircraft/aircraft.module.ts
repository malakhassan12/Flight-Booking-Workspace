import { Module } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { AircraftResolver } from './aircraft.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [AircraftResolver, AircraftService],
  imports: [ClientGatewayModule],
})
export class AircraftModule {}
