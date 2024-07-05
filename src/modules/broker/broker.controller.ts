import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,

  NotFoundException,
    BadRequestException,
    ForbiddenException,
    ConflictException,
    UnprocessableEntityException,    
    InternalServerErrorException,
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBrokerDto } from 'src/common/dto/update-broker.dto';
import { SetActiveBrokerDto } from 'src/common/dto/set-active-broker.dto';

import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';


@ApiTags('Broker')
@Controller('api/brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('all-users')
  async findAll(): Promise<object> {

   try{ return await this.brokerService.findAll();}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`Users`);
    }
   }

  }

  @Get('/')
  async getUsersByRoleId(): Promise<any> {
   try{ return this.brokerService.findByRoleId();}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`User`);
    } else if (error instanceof ForbiddenException) {
      throw new CustomForbiddenException();
    } else if (error instanceof CustomInternalServerErrorException ) {
      throw new CustomServiceException('BrokerService', 'getSiteById');
    } else {
      throw new CustomBadRequestException();
    }
   }
  }

  @Put('update-broker/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateBroker(
    @Param('id') id: number,
    @Body() updateBrokerDto: UpdateBrokerDto,
  ) {
    try{return this.brokerService.updateBroker(id, updateBrokerDto);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`User with ID ${id}`);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('User');
      } else {
        throw new CustomBadRequestException();
      }
    }
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
