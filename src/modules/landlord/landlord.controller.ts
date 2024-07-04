import { Controller, Get, Post, Body, Patch, Param, Delete , NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,    
  InternalServerErrorException,
} from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import { UpdateLandlordDto } from './dto/update-landlord.dto';
import { Landlord } from './entities/landlord.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';


@ApiTags('Landlord')
@Controller('api/landlords')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}

  @Post('landlord')
  async create(@Body() createLandlordDto: CreateLandlordDto): Promise<Landlord> {
    try{ return await this.landlordService.create(createLandlordDto);}
    catch(error){
    if (error instanceof BadRequestException) {
      throw new CustomBadRequestException();
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomInternalServerErrorException('createLandlord');
    } else {
      throw new CustomBadRequestException();
    }
  }
    
  }

  @Get('/')
  async findAll(): Promise<Landlord[]> {
   try{ return await this.landlordService.findAll();}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`Landlords`);
    }
   }
  }

  @Get('landlord/:id')
  async findOne(@Param('id') id: number): Promise<Landlord> {
   try{ return await this.landlordService.findOne(id);}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`Landlord with ID ${id}`);
    } else if (error instanceof ForbiddenException) {
      throw new CustomForbiddenException();
    } else if (error instanceof CustomInternalServerErrorException ) {
      throw new CustomServiceException('LandlordService', 'findOne');
    } else {
      throw new CustomBadRequestException();
    }
   }
  }

  @Patch('landlord/:id')
  async update(@Param('id') id: number, @Body() updateLandlordDto: UpdateLandlordDto): Promise<Landlord> {
    try{return await this.landlordService.update(id, updateLandlordDto);}
    catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Landlord with ID ${id}`);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Landlord');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Delete('landlord/:id')
  async remove(@Param('id') id: number): Promise<void> {
   try{ return await this.landlordService.remove(id);}
   catch(error){
    if (error instanceof NotFoundException) {
      throw new CustomNotFoundException(`Landlord with ID ${id}`);
    } else if (error instanceof ForbiddenException) {
      throw new CustomForbiddenException();
    } else if (error instanceof InternalServerErrorException) {
      throw new CustomServiceException('LandlordService', 'remove');
    } else {
      throw new CustomBadRequestException();
    }

   }
  }
}
