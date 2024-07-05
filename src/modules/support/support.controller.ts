import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  
  UnauthorizedException,

} from '@nestjs/common';
import { SupportService } from './support.service';
import { RaiseTicketDto } from '../../common/dto/raise-ticket.dto';
import { ApiTags } from '@nestjs/swagger';
import {CustomUnauthorizedException} from '../../exceptions/custom-exceptions';

@ApiTags('Support')
@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('raise-ticket')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async raiseTicket(@Body() raiseTicketDto: RaiseTicketDto) {
    try{return await this.supportService.raiseTicket(raiseTicketDto);}
    catch(error){
      if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } 
      else {
        throw new Error();
      }
    }
  }
}
