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
    UseGuards,
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { Users } from 'src/common/entities/user.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
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
import { UserAuth } from '../../common/gaurds/auth/user-auth.decorator';
import { AuthGuard } from '../../common/gaurds/auth/auth.gaurd';


@ApiTags('Broker')
@Controller('api/brokers')

export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('all-users')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' }) 
  async findAll(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<object> {
   try{ return await this.brokerService.findAll();}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`Users`);
    }
   }

  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getAllUsers(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
  ): Promise<any> {
   try{ return this.brokerService.findAllUsers();}
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
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async updateBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
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
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setActiveBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id') id: number,
    @Body() setActiveBrokerDto: SetActiveBrokerDto,
  ) {
    return this.brokerService.setActiveBroker(id, setActiveBrokerDto);
  }

  @Delete('delete-broker/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  @HttpCode(HttpStatus.OK)
  async deleteBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id') id: number): Promise<any> {
    return this.brokerService.deleteBroker(id);
  }

  
}
