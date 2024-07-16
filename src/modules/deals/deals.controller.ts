import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { Deals } from '../../common/entities/deals.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreateDealDto } from '../../common/dto/create-deal.dto';
import { UpdateDealDto } from '../../common/dto/update-deal.dto';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomUnauthorizedException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
} from '../../exceptions/custom-exceptions';
import { AuthGuard } from '../../common/gaurds/auth/auth.gaurd';
import { UserAuth } from '../../common/gaurds/auth/user-auth.decorator';

@ApiTags('Deals')
@Controller('api/deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('deal')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async createDeal(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Body() createDealDto: CreateDealDto,
  ): Promise<Deals> {
    try {
      return await this.dealsService.createDeal(createDealDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomConflictException('Deal');
      } else if (error instanceof BadRequestException) {
        throw new CustomBadRequestException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'createDeal');
      } else {
        throw new CustomNotFoundException(error.message);
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getAllDeals(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<Deals[]> {
    try {
      return await this.dealsService.getAllDeals();
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getAllDeals');
      } else if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Get('dealsData')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getAllDealsData(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<Deals[]> {
    try {
      return this.dealsService.findAllDealsData();
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getAllDeals');
      } else if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Get('assignedTo/:assignedTo')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getDealsByAssignedTo(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('assignedTo', ParseIntPipe) assignedTo: number,
  ): Promise<Deals[]> {
    try {
      const deals = await this.dealsService.getDealsByAssignedTo(assignedTo);
      if (!deals || deals.length === 0) {
        throw new CustomNotFoundException('Deals');
      }
      return deals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException(
          'DealsService',
          'getDealsByAssignedTo',
        );
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Get('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async getDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Deals> {
    try {
      return await this.dealsService.getDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getDealById');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Put('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async updateDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    try {
      return await this.dealsService.updateDealById(id, updateDealDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Deal');
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'updateDealById');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Delete('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async deleteDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Deals> {
    try {
      return await this.dealsService.deleteDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'deleteDealById');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }
}
