// import { bootstrapMicroservice } from '@flight-booking-workspace/core';
// import { ConfigService } from '@nestjs/config';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// /**
//  * This is not a production server yet!
//  * This is only a minimal backend to get started.
//  */

// import { NestFactory } from '@nestjs/core';
// import { FlightModule } from './app/flight.module';

// async function bootstrap() {
//   const context = await NestFactory.createApplicationContext(FlightModule);

//   const configService = context.get(ConfigService);
//   console.log('From Flight-service', configService.get<number>('PORT'));

//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     FlightModule,
//     {
//       transport: Transport.KAFKA,
//       options: {
//         client: {
//           clientId: configService.get<string>('FLIGHT_CLIENT_ID') || '',

//           brokers: [configService.get<string>('KAFKA_BROKER') || ''],
//         },
//         consumer: {
//           groupId: configService.get<string>('FLIGHT_GROUP_ID') || '',
//         },
//       },
//     },
//   );

//   bootstrapMicroservice(app);

//   await app.listen();
// }

// bootstrap();

import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { FlightModule } from './app/flight.module';
import { ConsulService } from '@flight-booking-workspace/consul';

async function bootstrap() {
  // 1. Create a hybrid app or main context that listens on a physical port
  const app = await NestFactory.create(FlightModule);

  const configService = app.get(ConfigService);
  // const port = configService.get<number>('PORT') || 3003;

  const consulService = app.get(ConsulService);

  const port = await consulService.getValue(
    'flight-service/FLIGHT_SERVICE_PORT',
  );
  console.log('From Flight-service Health Port:', port);

  const FLIGHT_CLIENT_ID = await consulService.getValue(
    'flight-service/FLIGHT_CLIENT_ID',
  );

  const FLIGHT_GROUP_ID = await consulService.getValue(
    'flight-service/FLIGHT_GROUP_ID',
  );

  const KAFKA_BROKER = await consulService.getValue('api-gateway/kafka/broker');

  console.log('========== KAFKA CONFIG ==========');
  console.log('CLIENT ID:', JSON.stringify(FLIGHT_CLIENT_ID));
  console.log('GROUP ID:', JSON.stringify(FLIGHT_GROUP_ID));
  console.log('BROKER:', JSON.stringify(KAFKA_BROKER));
  console.log('===================================');

  // 2. Connect the Kafka Microservice functionality to the same app instance
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        // clientId: configService.get<string>('FLIGHT_CLIENT_ID') || '',

        // brokers: [configService.get<string>('KAFKA_BROKER') || ''],

        clientId: FLIGHT_CLIENT_ID || '',

        brokers: [KAFKA_BROKER || ''],
      },
      consumer: {
        // groupId: configService.get<string>('FLIGHT_GROUP_ID') || '',
        groupId: FLIGHT_GROUP_ID || '',
      },
    },
  });

  // 3. Start the Kafka microservice listeners
  await app.startAllMicroservices();

  // 4. Start the HTTP/TCP server on the port Consul is checking
  await app.listen(port);
}

bootstrap();
