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
import { LoginDto } from '../../common/dto/login.dto';
import { InviteDto } from '../../common/dto/invite.dto';
import { ForgotPasswordDto } from '../../common/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../common/dto/reset-password.dto';
import { RegisterDto } from '../../common/dto/register.dto';
import { ChangePasswordDto } from '../../common/dto/change-password.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

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
  async register(@Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPassword(
    @Body() forgotPasswordLinkDTO: ForgotPasswordDto,
  ) {
    await this.authService.forgotPassword(forgotPasswordLinkDTO);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async changePassword(
    @Headers('resetToken') resetToken: string,
    @Body() changePasswordDTO: ChangePasswordDto,
  ) {
    const result = await this.authService.changePassword(
      resetToken,
      changePasswordDTO,
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
    // console.log(token);
    const result = await this.authService.logout(token);
    return result;
  }
}
