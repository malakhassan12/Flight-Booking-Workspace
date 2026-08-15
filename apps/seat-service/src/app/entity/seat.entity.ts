import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED',
  BOOKED = 'BOOKED',
}

export enum SeatClass {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

@Entity()
@Index(['flightId', 'seatNumber'], { unique: true })
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  flightId!: string;

  @Column({ length: 10 })
  seatNumber!: string;

  @Column({
    type: 'enum',
    enum: SeatClass,
  })
  class!: SeatClass;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status!: SeatStatus;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column('uuid', { nullable: true })
  bookingId!: string | null;

  // @Column('uuid', { nullable: true })
  // lockId!: string | null;

  // @Column({ type: 'timestamp', nullable: true })
  // lockedUntil!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
