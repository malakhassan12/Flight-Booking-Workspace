import models from './data/aircraftModels.data.json'
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
  for (const item of models) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: {
        name: item.manufacturer,
      },
    });

    if (!manufacturer) continue;

    await prisma.aircraftModel.upsert({
      where: {
        name_manufacturerId: {
          name: item.name,
          manufacturerId: manufacturer.id,
        },
      },
      update: {},
      create: {
        name: item.name,
        manufacturerId: manufacturer.id,
      },
    });
  }
}

main()
  .finally(() => prisma.$disconnect());