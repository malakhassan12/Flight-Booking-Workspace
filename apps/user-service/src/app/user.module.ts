import { CoreModule } from '@flight-booking-workspace/core';
import { SecurityModule } from '@flight-booking-workspace/security';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from './prisma/prisma.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [PrismaModule, SecurityModule, CoreModule, TokenModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
