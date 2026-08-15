
import { DataSource } from 'typeorm';
import { Seat } from '../app/entity/seat.entity';

export const seatProviders = [
  {
    provide: 'SEAT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Seat),
    inject: ['DATA_SOURCE'],
  },
];
