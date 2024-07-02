import { Controller, Get,NotFoundException,ForbiddenException,} from '@nestjs/common'; 
import { BrokerService } from './broker.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,  
  CustomForbiddenException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';
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
          throw new CustomNotFoundException('user with Roll ID not found');
        } else if (error instanceof ForbiddenException) {
          throw new CustomForbiddenException();
        } else if (error instanceof CustomInternalServerErrorException ) {
          throw new CustomServiceException('BrokerService', 'getSiteById');
        } else {
          throw new CustomBadRequestException();
        }
      }      
  }
} 
