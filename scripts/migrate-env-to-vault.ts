import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

// vault-server
const VAULT_URL = 'http://localhost:8200';
const VAULT_TOKEN = 'hvs.gfLhSVaAFe9tzBjHbmUuVjEN';

const SERVICES = [
  // 'auth-service',
  // 'user-service',
  // 'flight-service',
  // 'api-gateway',
  'seat-service'
];

if (!VAULT_TOKEN) {
  throw new Error(
    'VAULT_TOKEN is required. Set it before running the migration.',
  );
}

async function migrateService(serviceName: string) {
  const envPath = path.join(
    process.cwd(),
    'apps',
    serviceName,
    '.env',
  );

  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️ .env not found for ${serviceName}: ${envPath}`);
    return;
  }

  console.log(`\n🔄 Processing ${serviceName}...`);

  const envFile = fs.readFileSync(envPath, 'utf8');

  const parsedEnv = dotenv.parse(envFile);

  if (!Object.keys(parsedEnv).length) {
    console.warn(`⚠️ No values found in ${envPath}`);
    return;
  }

  const vaultPath = `secret/data/${serviceName}`;

  await axios.post(
    `${VAULT_URL}/v1/${vaultPath}`,
    {
      data: parsedEnv,
    },
    {
      headers: {
        'X-Vault-Token': VAULT_TOKEN,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log(
    `✅ ${serviceName} migrated successfully`,
  );

  console.log(
    `   Vault path: ${vaultPath}`,
  );

  console.log(
    `   Keys: ${Object.keys(parsedEnv).join(', ')}`,
  );
}

async function main() {
  console.log('======================================');
  console.log('🚀 ENV → VAULT MIGRATION');
  console.log('======================================');

  console.log(`Vault URL: ${VAULT_URL}`);

  for (const service of SERVICES) {
    try {
      await migrateService(service);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `❌ Failed to migrate ${service}`,
        );

        console.error(
          `Status: ${error.response?.status}`,
        );

        console.error(
          `Response:`,
          error.response?.data,
        );
      } else {
        console.error(
          `❌ Failed to migrate ${service}`,
          error,
        );
      }
    }
  }

  console.log('\n======================================');
  console.log('🏁 Migration finished');
  console.log('======================================');
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
