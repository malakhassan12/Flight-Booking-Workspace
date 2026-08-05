import { PrismaClient } from './../src/generated/prisma/client';
import 'dotenv/config';
import countries from './data/countries.data.json';
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
  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        iso2: country.alpha2Code,
      },
      update: {},
      create: {
        name: country.name,
        nativeName: country.nativeName,
        iso2: country.alpha2Code,
        iso3: country.alpha3Code,
        numericCode: country.numericCode,

        capital: country.capital,

        phoneCode: country.callingCodes?.[0] ?? null,

        currency: country.currencies?.[0]?.code ?? null,
        currencyName: country.currencies?.[0]?.name ?? null,
        currencySymbol: country.currencies?.[0]?.symbol ?? null,

        language: country.languages?.[0]?.name ?? null,
        languageCode: country.languages?.[0]?.iso639_1 ?? null,

        region: country.region,
        subregion: country.subregion,

        population: country.population,
        area: country.area,
        gini: country.gini,

        latitude: country.latlng?.[0] ?? null,
        longitude: country.latlng?.[1] ?? null,

        timezone: country.timezones?.[0] ?? null,

        demonym: country.demonym,

        flag: country.flag,
      },
    });
  }

  console.log('Countries seeded successfully!');
}


main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();
    await pool.end();

    process.exit(1);
  });
