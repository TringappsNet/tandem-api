import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { Users } from 'src/common/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBrokerDto } from 'src/common/dto/update-broker.dto';
import { SetActiveBrokerDto } from 'src/common/dto/set-active-broker.dto';

@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('all-users')
  async findAll(): Promise<object> {
    return await this.brokerService.findAll();
  }

  @Get('/')
  async getUsersByRoleId(): Promise<any> {
    return this.brokerService.findByRoleId();
  }


  @Put('update-broker/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateBroker(
    @Param('id') id: number,
    @Body() updateBrokerDto: UpdateBrokerDto,
  ) {
    return this.brokerService.updateBroker(id, updateBrokerDto);
  }

  @Put('set-active-broker/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setActiveBroker(
    @Param('id') id: number,
    @Body() setActiveBrokerDto: SetActiveBrokerDto,
  ) {
    return this.brokerService.setActiveBroker(id, setActiveBrokerDto);
  }

  @Delete('delete-broker/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBroker(@Param('id') id: number): Promise<any> {
    return this.brokerService.deleteBroker(id);
  }
}
