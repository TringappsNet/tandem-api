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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { Deals } from '../../common/entities/deals.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateDealDto } from '../../common/dto/create-deal.dto';
import { UpdateDealDto } from '../../common/dto/update-deal.dto';

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
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create deal');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllDeals(): Promise<any> {
    try {
      return await this.dealsService.getAllDeals();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve deals');
    }
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  async getDealsByCreatedBy(
    @Param('createdBy') createdBy: number,
  ): Promise<any> {
    try {
      return await this.dealsService.getDealsByCreatedBy(createdBy);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Failed to retrieve deals for the specified creator');
    }
  }

  @Get('deal/:id')
  @HttpCode(HttpStatus.OK)
  async getDealById(@Param('id') id: number): Promise<Deals> {
    try {
      return await this.dealsService.getDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Failed to retrieve the deal');
    }
  }

  @Put('deal/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateDealById(
    @Param('id') id: number,
    @Body() updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    try {
      return await this.dealsService.updateDealById(id, updateDealDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to update the deal');
    }
  }

  @Delete('deal/:id')
  @HttpCode(HttpStatus.OK)
  async deleteDealById(@Param('id') id: number): Promise<Deals> {
    try {
      return await this.dealsService.deleteDealById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Failed to delete the deal');
    }
  }
}
