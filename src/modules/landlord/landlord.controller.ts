import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from '../../common/dto/create-landlord.dto';
import { UpdateLandlordDto } from '../../common/dto/update-landlord.dto';
import { Landlord } from '../../common/entities/landlord.entity';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';
import { AuthGuard } from '../../common/gaurds/auth/auth.gaurd';
import { UserAuth } from '../../common/gaurds/auth/user-auth.decorator';

@ApiTags('Landlord')
@Controller('api/landlords')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}

  @Post('landlord')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async create(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Body() createLandlordDto: CreateLandlordDto,
  ): Promise<Landlord> {
    try {
      return await this.landlordService.create(createLandlordDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new CustomBadRequestException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomInternalServerErrorException('createLandlord');
      } else {
        throw new CustomBadRequestException(error.message);
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
  async findAll(
    @UserAuth() userAuth: { userId: number; accessToken: string },
  ): Promise<Landlord[]> {
    try {
      return await this.landlordService.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      }
    }
  }

  @Get('landlord/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async findOne(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
  ): Promise<Landlord> {
    try {
      return await this.landlordService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof CustomInternalServerErrorException) {
        throw new CustomServiceException('LandlordService', 'findOne');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Patch('landlord/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async update(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
    @Body() updateLandlordDto: UpdateLandlordDto,
  ): Promise<Landlord> {
    try {
      return await this.landlordService.update(id, updateLandlordDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Landlord');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }

  @Delete('landlord/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({
    name: 'access-token',
    required: true,
    description: 'Access Token',
  })
  async remove(
    @UserAuth() userAuth: { userId: number; accessToken: string },
    @Param('id') id: number,
  ): Promise<void> {
    try {
      return await this.landlordService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('LandlordService', 'remove');
      } else {
        throw new CustomBadRequestException(error.message);
      }
    }
  }
}
