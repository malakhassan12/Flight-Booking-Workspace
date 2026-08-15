import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';
import { VaultModule, VaultService } from '@flight-booking-workspace/vault';

@Module({
  imports : [VaultModule],
  controllers: [PrismaController],
  providers: [PrismaService,
     {
      provide: PrismaService,
      inject: [VaultService],
      useFactory: async (vaultService: VaultService) => {
        const secrets = await vaultService.getSecret('flight-service');
        if (!secrets?.DATABASE_URL) {
          throw new Error(
            'DATABASE_URL was not found in Vault at flight-service',
          );
        }
        return new PrismaService(secrets.DATABASE_URL);
      },
    },
  ],
  exports:[PrismaService]
})
export class PrismaModule {}
