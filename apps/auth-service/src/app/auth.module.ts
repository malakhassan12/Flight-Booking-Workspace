import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreModule } from '@flight-booking-workspace/core';
import { SecurityModule } from '@flight-booking-workspace/security';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsulModule, ConsulService } from '@flight-booking-workspace/consul';
import { VaultModule } from '@flight-booking-workspace/vault';

@Module({
  imports: [
    VaultModule,
    ConsulModule,
    SecurityModule,
    CoreModule,
    ClientsModule.registerAsync([
      // {
      //   imports: [ConfigModule],
      //   name: 'USER_SERVICE',
      //   useFactory: async (configService: ConfigService) => {
      //     console.log({
      //       host: configService.get('USER_SERVICE_HOST'),
      //       port: configService.get('USER_SERVICE_PORT'),
      //     });

      //     return {
      //       transport: Transport.TCP,
      //       options: {
      //         host: configService.get('USER_SERVICE_HOST'),
      //         port: Number(configService.get('USER_SERVICE_PORT')),
      //       },
      //     };
      //   },
      //   inject: [ConfigService],
      // },

      {
        imports: [ConsulModule],
        name: 'USER_SERVICE',
        useFactory: async (consulService: ConsulService) => {
          return {
            transport: Transport.TCP,
            options: {
              host:
                (await consulService.getValue(
                  'user-service/USER_SERVICE_HOST',
                )) || '',
              port: Number(
                (await consulService.getValue(
                  'user-service/USER_SERVICE_PORT',
                )) || '0',
              ),
            },
          };
        },
        inject: [ConsulService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
