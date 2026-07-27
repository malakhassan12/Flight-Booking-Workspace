import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientGatewayModule } from '../clientGateway.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ClientGatewayModule],
})
export class UserModule {}
