import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreModule } from '@flight-booking-workspace/core';
import { SecurityModule } from '@flight-booking-workspace/security';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SecurityModule,
    CoreModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'USER_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USER_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
