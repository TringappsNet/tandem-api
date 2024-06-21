import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/common/dto/login.dto';
import { AuthService } from './auth.service';
import { InviteDto } from 'src/common/dto/invite.dto';
import { ForgotPasswordLinkDto } from 'src/common/dto/forgot-password-link.dto';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/common/dto/register.dto';
import { ForgotPasswordDto } from 'src/common/dto/forgot-password.dto';

@ApiTags('Auth')
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

  @Post('register')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async registerDetails(@Body() registerData: RegisterDto) {
    return await this.authService.registerDetails(registerData);
  }

  @Post('forgot-password-link')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPasswordLink(@Body() forgotPasswordLinkDTO: ForgotPasswordLinkDto) {
    await this.authService.forgotPasswordLink(forgotPasswordLinkDTO);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPassword(
    @Headers('resetToken') resetToken: string,
    @Body() forgotPasswordDTO: ForgotPasswordDto,
  ) {
    const result = await this.authService.forgotPassword(
      resetToken,
      forgotPasswordDTO,
    );
    return result;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDTO);
    return { message: 'Reset Password successfully' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('Authorization') token: string) {
    console.log(token);
    const result = await this.authService.logout(token);
    return result;
  }
}
