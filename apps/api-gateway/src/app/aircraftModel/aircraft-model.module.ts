import { Module } from '@nestjs/common';
import { AircraftModelService } from './aircraft-model.service';
import { AircraftModelResolver } from './aircraft-model.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [AircraftModelResolver, AircraftModelService],
  imports: [ClientGatewayModule],
})
export class AircraftModelModule {}
