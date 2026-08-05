import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportResolver } from './airport.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [AirportResolver, AirportService],
  imports: [ClientGatewayModule],
})
export class AirportModule {}
