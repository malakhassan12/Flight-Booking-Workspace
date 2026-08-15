import { Module } from '@nestjs/common';
import { databaseProviders } from '../../provider/db.provider';
import { seatProviders } from '../../provider/seat.provider';

@Module({
  providers: [...databaseProviders, ...seatProviders],
  exports: [...databaseProviders, ...seatProviders],
})
export class TypeormModule {}
