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
import { ForgotPasswordLinkDto } from 'src/common/dto/forgot-password-link.dto';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(@Body() loginDTO: LoginDto) {
    const result = await this.authService.login(loginDTO);
    return result;
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordLinkDto) {
    await this.authService.forgotPassword(forgotPasswordDTO);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDTO);
    return { message: 'Reset Password successfully' };
  }
}
