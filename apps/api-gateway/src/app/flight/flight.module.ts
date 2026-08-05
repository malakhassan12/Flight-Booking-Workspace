import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightResolver } from './flight.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  imports: [ClientGatewayModule],

  providers: [FlightResolver, FlightService],
})
export class FlightModule {}
