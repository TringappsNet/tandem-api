import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { Users } from '../../common/entities/user.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { UpdateBrokerDto } from '../../common/dto/update-broker.dto';
import { SetActiveBrokerDto } from '../../common/dto/set-active-broker.dto';

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
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async findAll(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<object> {
    try {
      return await this.brokerService.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      }
    }
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getAllBrokers(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<any> {
    try {
      return await this.brokerService.getAllBrokersData();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof CustomInternalServerErrorException) {
        throw new CustomServiceException('BrokerService', 'getSiteById');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Get('brokerwithdeals/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getBrokerByIdWithDeals(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
  ): Promise<Users | any> {
    try {
      return await this.brokerService.getBrokerByIdWithDeals(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Broker');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Put('broker/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async updateBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
    @Body() UpdateBrokerDto: UpdateBrokerDto,
  ): Promise<Users> {
    try {
      return await this.brokerService.updateBroker(id, UpdateBrokerDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Broker');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Put('set-active-broker/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setActiveBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
    @Body() setActiveBrokerDto: SetActiveBrokerDto,
  ) {
    try {
      return await this.brokerService.setActiveBroker(id, setActiveBrokerDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Broker');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Delete('broker/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async deleteBroker(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
  ): Promise<void> {
    try {
      const deleteBroker = await this.brokerService.deleteBroker(id);
      return deleteBroker;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('brokerService', 'deleteBroker');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }
}
