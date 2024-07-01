import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import { UpdateLandlordDto } from './dto/update-landlord.dto';
import { Landlord } from './entities/landlord.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Landlord')
@Controller('api/landlords')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}

  @Post('landlord')
  async create(@Body() createLandlordDto: CreateLandlordDto): Promise<Landlord> {
    return await this.landlordService.create(createLandlordDto);
  }

  @Get('/')
  async findAll(): Promise<Landlord[]> {
    return await this.landlordService.findAll();
  }

  @Get('landlord/:id')
  async findOne(@Param('id') id: number): Promise<Landlord> {
    return await this.landlordService.findOne(id);
  }

  @Patch('landlord/:id')
  async update(@Param('id') id: number, @Body() updateLandlordDto: UpdateLandlordDto): Promise<Landlord> {
    return await this.landlordService.update(id, updateLandlordDto);
  }

  @Delete('landlord/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.landlordService.remove(id);
  }
}
