import { Module } from '@nestjs/common';
import { ClientGatewayModule } from '../clientGateway.module';
import { AircraftLayoutService } from './aircraft-layout.service';
import { AircraftLayoutResolver } from './aircraft-layout.resolver';

@Module({
  providers: [AircraftLayoutService, AircraftLayoutResolver],
  imports: [ClientGatewayModule],
})
export class AircraftLayoutModule {}
