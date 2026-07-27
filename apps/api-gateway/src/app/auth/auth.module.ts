import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ClientGatewayModule],
})
export class AuthModule {}
