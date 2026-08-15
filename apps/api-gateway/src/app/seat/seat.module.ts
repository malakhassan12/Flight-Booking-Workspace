import { Module } from '@nestjs/common';
import { SeatResolver } from './seat.resolver';
import { SeatService } from './seat.service';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [SeatResolver, SeatService],
  imports: [ClientGatewayModule],
})
export class SeatModule {}
