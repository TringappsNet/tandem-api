import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DealsService } from './deals.service';
import { Deals } from 'src/common/entities/deals.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateDealDto } from 'src/common/dto/create-deal.dto';
import { UpdateDealDto } from 'src/common/dto/update-deal.dto';

@ApiTags('Deals')
@Controller('api/deals')
export class DealsController {
    constructor(private readonly dealsService: DealsService) {}

    @Post('deal')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async createDeal(@Body() createDealDto: CreateDealDto): Promise<Deals> {
        return this.dealsService.createDeal(createDealDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async getAllDeals(): Promise<Deals[]> {
        return this.dealsService.getAllDeals();
    } 

    // @Get('deals/:id')
    // @HttpCode(HttpStatus.OK)
    // @UsePipes(ValidationPipe)
    // async getDealsById(
    //     @Param('id') id: number,
    // ): Promise<Deals[]> {
    //     return this.dealsService.getDealsById(id)
    // }

    @Get('deal/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async getDealById(
        @Param('id') id: number,
    ): Promise<Deals> {
        return this.dealsService.getDealById(id)
    }

    @Put('deal/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async updateDealById(
        @Param('id') id: number,
        @Body() updateDealDto: UpdateDealDto,
    ): Promise<Deals> {
        return this.dealsService.updateDealById(id, updateDealDto)
    }

    @Delete('deal/:id')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async deleteDealById(
        @Param('id') id: number,
    ): Promise<Deals> {
        return this.dealsService.deleteDealById(id)
    }
}
