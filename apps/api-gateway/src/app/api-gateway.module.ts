import { Module } from '@nestjs/common';
import { APIGatewayController } from './api-gateway.controller';
import { APIGatewayService } from './api-gateway.service';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  RolesGuard,
  SecurityModule,
} from '@flight-booking-workspace/security';
import { CommonModule } from '@flight-booking-workspace/common';
import { CoreModule } from '@flight-booking-workspace/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientGatewayModule } from './clientGateway.module';
import { AirportModule } from './airport/airport.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AirlineModule } from './airline/airline.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { AircraftModelModule } from './aircraftModel/aircraft-model.module';
import { FlightModule } from './flight/flight.module';

@Module({
  imports: [
    SecurityModule,
    CoreModule,
    CommonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(process.cwd(), 'apps/api-gateway/**/*.gql')],
      definitions: {
        path: join(process.cwd(), 'libs/graphql-types/src/index.ts'),
        outputAs: 'class',
      },
      formatError: (formattedError) => {
        return {
          message: formattedError.message,
          status: formattedError.extensions?.status ?? 500,
        };
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }: any) => ({
        req,
        res,
      }),
      // Inn production
      // playground:false,
      // debug:false
    }),

    // ClientsModule.registerAsync([
    //   {
    //     imports: [ConfigModule],
    //     name: 'USER_SERVICE',
    //     useFactory: async (configService: ConfigService) => {
    //       console.log('USER_SERVICE', {
    //         host: configService.get('USER_SERVICE_HOST'),
    //         port: configService.get('USER_SERVICE_PORT'),
    //       });

    //       return {
    //         transport: Transport.TCP,
    //         options: {
    //           host: configService.get('USER_SERVICE_HOST'),
    //           port: Number(configService.get('USER_SERVICE_PORT')),
    //         },
    //       };
    //     },
    //     inject: [ConfigService],
    //   },

    //   {
    //     imports: [ConfigModule],
    //     name: 'AUTH_SERVICE',
    //     useFactory: async (config: ConfigService) => {
    //       console.log('AUTH CONFIG', {
    //         host: config.get('AUTH_SERVICE_HOST'),
    //         port: config.get('AUTH_SERVICE_PORT'),
    //       });

    //       return {
    //         transport: Transport.TCP,
    //         options: {
    //           host: config.get('AUTH_SERVICE_HOST'),
    //           port: Number(config.get('AUTH_SERVICE_PORT')),
    //         },
    //       };
    //     },
    //     inject: [ConfigService],
    //   },
    // ]),

    ClientGatewayModule,

    UserModule,

    AuthModule,

    AirportModule,

    AirlineModule,

    AircraftModule,

    ManufacturerModule,

    AircraftModelModule,

    FlightModule,
  ],
  controllers: [APIGatewayController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    APIGatewayService,
  ],
})
export class APIGatewayModule {}
