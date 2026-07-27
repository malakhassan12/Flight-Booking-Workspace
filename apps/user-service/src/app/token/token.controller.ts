import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  DeleteRefreshToken,
  SaveRefreshToken,
  UpdateRefreshToken,
  VerifyRefreshToken,
} from '@flight-booking-workspace/common';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern({
    cmd: 'save-refresh-token',
  })
  saveRefreshToken(@Payload() data: SaveRefreshToken) {
    return this.tokenService.saveRefreshToken(data);
  }

  @MessagePattern({
    cmd: 'verify-refresh-token',
  })
  verifyRefreshToken(@Payload() data: VerifyRefreshToken) {
    return this.tokenService.verifyRefreshToken(data);
  }

  @MessagePattern({
    cmd: 'update-refresh-token',
  })
  updateRefreshToken(@Payload() data: UpdateRefreshToken) {
    return this.tokenService.updateRefreshToken(data);
  }

  @MessagePattern({
    cmd: 'delete-refresh-token',
  })
  deleteRefreshToken(@Payload() data: DeleteRefreshToken) {
    return this.tokenService.deleteRefreshToken(data);
  }
}
