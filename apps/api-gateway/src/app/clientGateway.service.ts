import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ClientGatewayService implements OnModuleInit {
  constructor(
    @Inject('FLIGHT_SERVICE')
    private readonly flightClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const patterns = [
      'airline.findAll',
      'airline.findOne',
      'airline.create',
      'airline.update',
      'airline.remove',
      'country.findByAirline',

      'airport.findAll',
      'airport.findOne',
      'airport.create',
      'airport.update',
      'airport.remove',
      'flight.findByAirline',
      'city.findByAirport',

      'manufacturer.findAll',
      'manufacturer.findOne',
      'manufacturer.create',
      'manufacturer.update',
      'manufacturer.remove',
      'aircraftList.findAll',
      'aircraftModels.findAll',
      'country.findByManufacturer',

      'aircraftModel.findAll',
      'aircraftModel.findOne',
      'aircraftModel.create',
      'aircraftModel.update',
      'aircraftModel.remove',
      'aircraftList.findByModel',
      'manufacturer.findByAircraftModel',

      'aircraft.findAll',
      'aircraft.findOne',
      'aircraft.create',
      'aircraft.update',
      'aircraft.remove',
      'aircarftModel.findByAircraft',
      'manufacturer.findByAircraft',
      'flight.findByAircraft',

      'flight.findAll',
      'flight.findOne',
      'flight.create',
      'flight.update',
      'flight.remove',
      'flight.changeStatus',
      'airline.findByFlight',
      'aircraft.findByFlight',
      'airport.findOriginByFlight',
      'airport.findDestinationByFlight',

    ];

    for (const pattern of patterns) {
      this.flightClient.subscribeToResponseOf(pattern);
    }

    await this.flightClient.connect();

    console.log('========== KAFKA CONNECTED From client ==========');
  }
}
