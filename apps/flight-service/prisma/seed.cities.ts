import { PrismaClient } from '../src/generated/prisma/client';
import cities from './data/cities.data.json';
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

interface CityJson {
  country: string;
  name: string;
  lat?: string;
  lng?: string;
}
async function main() {
  for (const city of (cities as CityJson[])) {

    const country = await prisma.country.findUnique({
      where: {
        iso2: city.country
      },
      select: {
        id: true,
      },
    });

    if (!country) {
      console.log(`Country ${city.country} not found`);
      continue;
    }

    await prisma.city.upsert({
      where: {
        name_countryId: {
          name: city.name,
          countryId: country.id,
        },
      },
      update: {},
      create: {
        name: city.name,
        countryId: country.id,
      },
    });
  }

  console.log("✅ Cities seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
