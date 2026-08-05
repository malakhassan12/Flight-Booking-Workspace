import aircraft from './data/aircraft.data.json';

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
  for (const item of aircraft) {
    const model = await prisma.aircraftModel.findFirst({
      where: {
        name: item.model,
      },
      include: {
        manufacturer: true,
      },
    });

    if (!model) {
      console.log(`Model ${item.model} not found`);
      continue;
    }

    await prisma.aircraft.upsert({
      where: {
        registrationNumber: item.registration,
      },
      update: {},
      create: {
        registrationNumber: item.registration,
        seatCapacity: item.seatCapacity,

        manufacturerId: model.manufacturerId,
        modelId: model.id,
      },
    });

    console.log(`✔ ${item.registration}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

main()
  .finally(() => prisma.$disconnect());