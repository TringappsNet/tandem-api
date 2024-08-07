import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { RaiseTicketDto } from '../../common/dto/raise-ticket.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  CustomInternalServerErrorException,
  CustomUnauthorizedException,
} from '../../exceptions/custom-exceptions';
import { AuthGuard } from '../../common/gaurds/auth/auth.gaurd';
import { UserAuth } from '../../common/gaurds/auth/user-auth.decorator';
import { PromotionalEmailsDto } from '../../common/dto/promotionals_emails.dto';

@ApiTags('Support')
@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('raise-ticket')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async raiseTicket(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Body() raiseTicketDto: RaiseTicketDto,
  ) {
    try {
      return await this.supportService.raiseTicket(raiseTicketDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException(error.message);
      } else {
        throw new CustomInternalServerErrorException('raise-ticket');
      }
    }
  }

  @Post('promotional-emails')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async promotionalEmails(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Body() promotionalEmailsDto: PromotionalEmailsDto,
  ) {
    try {
      return await this.supportService.promotionalEmails(promotionalEmailsDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException(error.message);
      } else {
        throw new CustomInternalServerErrorException('promotional-emails');
      }
    }
  }
}
