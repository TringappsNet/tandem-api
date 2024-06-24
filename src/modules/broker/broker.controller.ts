import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { CreateBrokerDto } from '../../common/dto/broker/create-broker.dto';
import { UpdateBrokerDto } from '../../common/dto/broker/update-broker.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get("/")
  findAll() {
    return this.brokerService.findAll();
  }

}
