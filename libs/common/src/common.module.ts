import { Module } from '@nestjs/common';
import { ConfigModule,  } from '@nestjs/config';

@Module({
  controllers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class CommonModule {}
