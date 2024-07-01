import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
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
  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(@Body() loginDTO: LoginDto) {
    try {
      const result = await this.authService.login(loginDTO);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async sendInvite(@Body() inviteDTO: InviteDto) {
    try {
      await this.authService.sendInvite(inviteDTO);
      return { message: 'Invitation sent successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async register(@Body() registerData: RegisterDto) {
    try {
      return await this.authService.register(registerData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPassword(
    @Body() forgotPasswordLinkDTO: ForgotPasswordDto,
  ) {
    try {
      await this.authService.forgotPassword(forgotPasswordLinkDTO);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async changePassword(
    @Headers('resetToken') resetToken: string,
    @Body() changePasswordDTO: ChangePasswordDto,
  ) {
    try {
      const result = await this.authService.changePassword(
        resetToken,
        changePasswordDTO,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(resetPasswordDTO);
      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {

        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('Authorization') token: string) {
    try {
      const result = await this.authService.logout(token);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
