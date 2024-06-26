import { Controller, Get, Param } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { Users } from 'src/common/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('/')
  async getUsersByRoleId(): Promise<any> {
    return this.brokerService.findByRoleId();
  }
}
