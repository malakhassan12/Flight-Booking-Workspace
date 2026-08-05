import { Module } from '@nestjs/common';
import { AircraftModelService } from './aircraft-model.service';
import { AircraftModelController } from './aircraft-model.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [AircraftModelController],
  providers: [AircraftModelService],
})
export class AircraftModelModule {}
