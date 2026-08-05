import { Prisma, PrismaClient } from './../src/generated/prisma/client';
import airports from './data/airports.data.json';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

type Airport = {
  iata: string;
  icao: string;
  city: string;
  country: string;
  name: string;
  tz?: string;
  lat: number;
  lon: number;
};

export async function seedAirports() {
  console.log('🌍 Seeding Airports...');

  for (const airport of Object.values(airports) as Airport[]) {
    try {
      // Skip invalid records
      if (!airport.iata || !airport.icao || !airport.city || !airport.country) {
        continue;
      }

      const country = await prisma.country.findUnique({
        where: {
          iso2: airport.country,
        },
        select: {
          id: true,
        },
      });

      if (!country) {
        console.log(`❌ Country not found: ${airport.country}`);
        continue;
      }

      const city = await prisma.city.findFirst({
        where: {
          name: airport.city,
          countryId: country.id,
        },
        select: {
          id: true,
        },
      });

      if (!city) {
        console.log(`❌ City not found: ${airport.city} (${airport.country})`);
        continue;
      }

      await prisma.airport.upsert({
        where: {
          icaoCode: airport.icao,
        },
        update: {
          name: airport.name,
          iataCode: airport.iata,
          timezone: airport.tz ?? '',
          latitude: new Prisma.Decimal(airport.lat),
          longitude: new Prisma.Decimal(airport.lon),
        },
        create: {
          name: airport.name,
          iataCode: airport.iata,
          icaoCode: airport.icao,
          cityId: city.id,
          timezone: airport.tz ?? '',
          latitude: new Prisma.Decimal(airport.lat),
          longitude: new Prisma.Decimal(airport.lon),
        },
      });
    } catch (error) {
      console.error(`Error seeding ${airport.name}`, error);
    }
  }

  console.log('✅ Airports Seeded Successfully');
}
