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
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { Deals } from '../../common/entities/deals.entity';
import { ApiTags } from '@nestjs/swagger';
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

@ApiTags('Deals')
@Controller('api/deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('deal')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async createDeal(@Body() createDealDto: CreateDealDto): Promise<Deals> {
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
  async getAllDeals(): Promise<Deals[]> {
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
  async getAllDealsData(): Promise<Deals[]> {
    return this.dealsService.getAllDeals();
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  async getDealsByCreatedBy(
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
  async getDealById(@Param('id', ParseIntPipe) id: number): Promise<Deals> {
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
  async updateDealById(
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
  async deleteDealById(@Param('id', ParseIntPipe) id: number): Promise<Deals> {
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
