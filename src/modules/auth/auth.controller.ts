import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/common/dto/login.dto';
import { AuthService } from './auth.service';
import { InviteDto } from 'src/common/dto/invite.dto';
import { TokenDto } from 'src/common/dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  login(@Body() loginData: LoginDto) {
    return this.authService.loginDetails(loginData.email, loginData.password);
  }

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  sendInvite(@Body() inviteDTO: InviteDto) {
    this.authService.sendInvite(inviteDTO);
    return { message: 'Invitation sent successfully' };
  }

  @Get('invite')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  tokenValidate(@Body() tokenDTO: TokenDto) {
    this.authService.tokenValidate(tokenDTO);
    return { message: 'Token has been verified successfully' };
  }
}
