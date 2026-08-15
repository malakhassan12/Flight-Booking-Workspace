import { Module } from '@nestjs/common';
import { AircraftLayoutService } from './aircraft-layout.service';
import { AircraftLayoutController } from './aircraft-layout.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AircraftLayoutController],
  providers: [AircraftLayoutService],
})
export class AircraftLayoutModule {}
