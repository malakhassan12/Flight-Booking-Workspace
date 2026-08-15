import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CoreModule } from '@flight-booking-workspace/core';
import { SecurityModule } from '@flight-booking-workspace/security';
import { ConsulModule } from '@flight-booking-workspace/consul';
import { VaultModule } from '@flight-booking-workspace/vault';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [VaultModule, ConsulModule, SecurityModule, CoreModule , PrismaModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
