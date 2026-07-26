import { APIGatewayService } from './api-gateway.service';
import {
  Controller,
  Inject,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import {
  DataResponse,
  Role,
  UpdateUserDto,
  type UserPayload,
} from '@flight-booking-workspace/common';
import {
  Public,
  User,
  LoginDto,
  SignUpDto,
  ResetPasswordDto,
  Roles,
} from '@flight-booking-workspace/security';
import type { Response, Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class APIGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,

    private readonly apiGatewayService: APIGatewayService,
  ) {}

  /* -------------------------------- Auth ------------------------------ */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto),
    );

    this.apiGatewayService.setRefreshCookie(response, result.data.refreshToken);

    return new DataResponse(
      'Login Successfully',
      HttpStatus.OK,
      result.data.accessToken,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() SignUpDto: SignUpDto) {
    await firstValueFrom(this.authClient.send({ cmd: 'sign-up' }, SignUpDto));

    return new DataResponse('Signup Successfully', HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('reset-password')
  async resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
    @User()
    user: UserPayload,
  ) {
    await firstValueFrom(
      this.authClient.send(
        { cmd: 'reset-password' },
        { resetPasswordDto, user },
      ),
    );

    return new DataResponse('Reset Password Successfully', HttpStatus.OK);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh-token'];

    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'refresh-token' }, refreshToken),
    );

    this.apiGatewayService.setRefreshCookie(response, result.data.refreshToken);

    return new DataResponse('Refresh Token Successfully', HttpStatus.OK);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
    @User() user: UserPayload,
  ) {
    const refreshToken = req.cookies['refresh-token'];

    await firstValueFrom(
      this.authClient.send({ cmd: 'logout' }, { refreshToken, user }),
    );

    this.apiGatewayService.clearRefreshCookie(res);

    return new DataResponse('Logout Successfully', HttpStatus.OK);
  }

  /*---------------------------------------- User -----------------------------------------*/

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
