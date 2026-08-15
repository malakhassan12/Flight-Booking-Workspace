import {  Module } from '@nestjs/common';
import { VaultService } from './vault.service';

@Module({
  controllers: [],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
