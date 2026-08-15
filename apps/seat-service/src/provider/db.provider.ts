import { DataSource } from 'typeorm';
import { Seat } from '../app/entity/seat.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',

    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',

        host: 'postgres',
        port: 5432,

        username: 'postgres',
        password: '123456',

        database: 'seat_db',

        // entities: [
        //   __dirname + '/../**/*.entity{.ts,.js}',
        // ],

        entities: [Seat],

        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
