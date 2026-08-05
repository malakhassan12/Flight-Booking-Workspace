import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { AirlineResolver } from './airline.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [AirlineResolver, AirlineService],
  imports: [ClientGatewayModule],
})
export class AirlineModule {}
