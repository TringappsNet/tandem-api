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
import { AuthGuard } from 'src/common/gaurds/auth/auth.gaurd';
import { UserAuth } from 'src/common/gaurds/auth/user-auth.decorator';

@ApiTags('Deals')
@Controller('api/deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('deal')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async createDeal(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Body() createDealDto: CreateDealDto): Promise<Deals> {
    try {
      return await this.dealsService.createDeal(createDealDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomConflictException('Deal');
      } else if (error instanceof BadRequestException) {
        throw new CustomBadRequestException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'createDeal');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getAllDeals(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 

  ): Promise<Deals[]> {
    try {
      return await this.dealsService.getAllDeals();
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getAllDeals');
      }
      throw new CustomBadRequestException();
    }
  }

  @Get('dealsData')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getAllDealsData(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 

  ): Promise<Deals[]> {
    return this.dealsService.findAllDealsData();
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getDealsByCreatedBy(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('createdBy', ParseIntPipe) createdBy: number,
  ): Promise<Deals[]> {
    try {
      const deals = await this.dealsService.getDealsByCreatedBy(createdBy);
      if (!deals || deals.length === 0) {
        throw new CustomNotFoundException('Deals');
      }
      return deals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException('Deals');
      } else if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getDealsByCreatedBy');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Get('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number): Promise<Deals> {
    try {
      return await this.dealsService.getDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Deal with ID ${id}`);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'getDealById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Put('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async updateDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    try {
      return await this.dealsService.updateDealById(id, updateDealDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Deal with ID ${id}`);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Deal');
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'updateDealById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Delete('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async deleteDealById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number): Promise<Deals> {
    try {
      return await this.dealsService.deleteDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Deal with ID ${id}`);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('DealsService', 'deleteDealById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }
}
