import { Controller, Get, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'; 
import { BrokerService } from './broker.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('/')
  async getUsersByRoleId(): Promise<any> {
    try {
      return await this.brokerService.findByRoleId();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
