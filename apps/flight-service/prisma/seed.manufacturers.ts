import manufacturers from './data/manufacturers.data.json';

import { PrismaClient } from './../src/generated/prisma/client';
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

async function main() {
  for (const item of manufacturers) {
    const country = await prisma.country.findUnique({
      where: {
        iso2: item.country,
      },
    });

    if (!country) continue;

    await prisma.manufacturer.upsert({
      where: {
        name: item.name,
      },
      update: {},
      create: {
        name: item.name,
        countryId: country.id,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
