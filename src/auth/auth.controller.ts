import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IRequest } from 'src/common/interface';

import { LocalAuthGuard } from 'src/common/middleware/local-auth-guard.middleware';
// import { GoogleAuthGuard } from 'src/common/middleware/google-auth-guard.middleware';
import { JwtAuthGuard } from 'src/common/middleware/jwt-auth-guard.middleware';
import { GoogleAuthGuard } from 'src/common/middleware/google-auth-guard.middleware';
import { LoginPayloadDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('/signup')
  async registerUser(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req: IRequest, @Body() body: LoginPayloadDto) {
    return this.authService.login(req.user);
  }

  // @Public()
  // @Post('/change-password')
  // async changePassword(@Req() req: IRequest, @Body() data: LoginPayloadDto) {
  //   return await this.authService.changePassword(data);
  // }

  @Public()
  @Post('/logout')
  @UseGuards(LocalAuthGuard)
  async logout(@Req() req: IRequest) {
    return req.logOut;
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/signin')
  async googleLogin() {
    return { message: 'Google Signin' };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect() {}

  @ApiBearerAuth()
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Req() req: IRequest) {
    return this.userService.findById(req.user.id);
  }
}
