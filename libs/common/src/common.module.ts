import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from './exception-filter/http-exception-filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  controllers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CommonModule {}
