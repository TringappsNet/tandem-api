import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { RaiseTicketDto } from 'src/common/dto/raise-ticket.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Support')
@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('raise-ticket')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async raiseTicket(@Body() raiseTicketDto: RaiseTicketDto) {
    return await this.supportService.raiseTicket(raiseTicketDto);
  }
}
