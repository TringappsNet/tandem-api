import { Controller, Get, Param } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { Users } from 'src/common/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('all-users')
  async findAll(): Promise<Users[]> {
    return await this.brokerService.findAll();
  }

  @Get('/')
  async getUsersByRoleId(): Promise<any> {
    return this.brokerService.findByRoleId();
  }
}
