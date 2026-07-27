import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignUpDto } from '@flight-booking-workspace/security';
import type { UserPayload } from '@flight-booking-workspace/common';
import { UpdateUserDto } from '@flight-booking-workspace/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(@Payload() data: SignUpDto) {
    return this.userService.create(data);
  }

  @MessagePattern({ cmd: 'update-user' })
  update(@Payload() data: { user: UserPayload; updateUserDto: UpdateUserDto }) {
    return this.userService.update(data.updateUserDto, data.user);
  }

  @MessagePattern({ cmd: 'delete-user' })
  remove(@Payload() user: UserPayload) {
    return this.userService.remove(user);
  }

  @MessagePattern({ cmd: 'find-all-users' })
  findAll(@Payload() data: { page: number; limit: number }) {
    return this.userService.findAll(data.page, data.limit);
  }

  @MessagePattern({ cmd: 'find-user' })
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern({ cmd: 'validate-user' })
  validateUser(@Payload() data: LoginDto) {
    return this.userService.validateUser(data);
  }

  @MessagePattern({ cmd: 'check-password' })
  checkPassword(
    @Payload()
    data: {
      id: string;
      password: string;
    },
  ) {
    return this.userService.checkPassword(data.id, data.password);
  }

  @MessagePattern({ cmd: 'reset-password' })
  resetPassword(
    @Payload()
    data: {
      id: string;
      password: string;
    },
  ) {
    return this.userService.resetPassword(data.id, data.password);
  }
}
