import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Get,
  Query,
  Delete,
  Param,
  Inject,
} from '@nestjs/common';
import {
  Role,
  UpdateUserDto,
  type UserPayload,
} from '@flight-booking-workspace/common';
import { User, Roles } from '@flight-booking-workspace/security';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(
    @User() user: UserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await firstValueFrom(
      this.userClient.send(
        { cmd: 'update-user' },
        {
          user,
          updateUserDto,
        },
      ),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async remove(@User() user: UserPayload) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'delete-user' }, user),
    );
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await firstValueFrom(
      this.userClient.send(
        { cmd: 'find-all-users' },
        {
          page: +page,
          limit: +limit,
        },
      ),
    );
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom(this.userClient.send({ cmd: 'find-user' }, id));
  }
}
