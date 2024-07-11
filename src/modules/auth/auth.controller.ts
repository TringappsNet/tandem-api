import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../../common/dto/login.dto';
import { InviteDto } from '../../common/dto/invite.dto';
import { ForgotPasswordDto } from '../../common/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../common/dto/reset-password.dto';
import { RegisterDto } from '../../common/dto/register.dto';
import { ChangePasswordDto } from '../../common/dto/change-password.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomUnauthorizedException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';
import { AuthGuard } from '../../common/gaurds/auth/auth.gaurd';
import { UserAuth } from '../../common/gaurds/auth/user-auth.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(@Body() loginDTO: LoginDto) {
    try {
      const result = await this.authService.login(loginDTO);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } else if (error instanceof BadRequestException) {
        throw new CustomBadRequestException();
      } else {
        throw new CustomInternalServerErrorException('login');
      }
    }
  }

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' }) 
  @UseGuards(AuthGuard)
  async sendInvite(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Body() inviteDTO: InviteDto) {
    try {
      await this.authService.sendInvite(inviteDTO);
      return { message: 'Invitation sent successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomConflictException('Invite');
      } else if (error instanceof BadRequestException) {
        throw new CustomBadRequestException();
      } else {
        throw new CustomInternalServerErrorException('sendInvite');
      }
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async register(@Body() registerData: RegisterDto) {
    try {
      const result = await this.authService.register(registerData);
      return { message: 'Registration successful', data: result };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomConflictException('User');
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else {
        throw new CustomInternalServerErrorException('register');
      }
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)

  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDto) {
    try {
      await this.authService.forgotPassword(forgotPasswordDTO);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException('User');
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else {
        throw new CustomInternalServerErrorException('forgotPassword');
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
      return { message: 'Password changed successfully', data: result };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new CustomBadRequestException();
      } else if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } else {
        throw new CustomInternalServerErrorException('changePassword');
      }
    }
  }

  @Post('reset-password')
@HttpCode(HttpStatus.OK)
@UsePipes(ValidationPipe)
@ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
@ApiHeader({ name: 'access-token', required: true, description: 'Access Token' }) 
@UseGuards(AuthGuard)
async resetPassword(
  @UserAuth() userAuth: { userId: number; accessToken: string },
  @Body() resetPasswordDTO: ResetPasswordDto
) {
  try {
    const result = await this.authService.resetPassword(resetPasswordDTO);
    return { message: 'Password reset successfully', data: result }; 
  } catch (error) {
    if (error instanceof UnprocessableEntityException) {
      throw new CustomUnprocessableEntityException();
    } else if (error instanceof BadRequestException) {
      throw new CustomBadRequestException();
    } else {
      throw new CustomInternalServerErrorException('resetPassword');
    }
  }
}
  
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('Authorization') token: string) {
    try {
      const result = await this.authService.logout(token);
      return { message: 'Logout successful', data: result };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else {
        throw new CustomInternalServerErrorException('logout');
      }
    }
  }
}
