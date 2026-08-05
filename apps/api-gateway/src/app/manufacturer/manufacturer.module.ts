import { Module } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerResolver } from './manufacturer.resolver';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  providers: [ManufacturerResolver, ManufacturerService],
  imports: [ClientGatewayModule],
})
export class ManufacturerModule {}
