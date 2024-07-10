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
    ForbiddenException,
    ConflictException,
    UnprocessableEntityException,    
    InternalServerErrorException,
    UseGuards,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Sites } from '../../common/entities/sites.entity';
import { CreateSiteDto } from '../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../common/dto/update-site.dto';
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


@ApiTags('Sites')
@Controller('api/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post('site')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async createSite(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Body() createSiteDto: CreateSiteDto): Promise<Sites> {
    try {
      return await this.sitesService.createSite(createSiteDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new CustomConflictException('Site', 'Address already exists');
      } else if (error instanceof CustomBadRequestException) {
        throw new BadRequestException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomInternalServerErrorException('createSite');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }
  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async getAllSites(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
  ): Promise<Sites[]> {
    try{    return this.sitesService.getAllSites();
    }catch(error){
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Sites`);
      }
    }
  }

  @Get('site/:id')
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  @HttpCode(HttpStatus.OK)
  async getSiteById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number): Promise<Sites> {
    try {
      return await this.sitesService.getSiteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Site with ID ${id}`);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof CustomInternalServerErrorException ) {
        throw new CustomServiceException('SitesService', 'getSiteById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Put('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async updateSiteById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Sites> {
    try {
      return await this.sitesService.updateSite(id, updateSiteDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Site with ID ${id}`);
      } else if (error instanceof UnprocessableEntityException) {
        throw new CustomUnprocessableEntityException();
      } else if (error instanceof ConflictException) {
        throw new CustomConflictException('Site');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Delete('site/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'user-id', required: true, description: 'User ID' })
  @ApiHeader({ name: 'access-token', required: true, description: 'Access Token' })
  async deleteSiteById(
    @UserAuth() userAuth: { userId: number; accessToken: string }, 
    @Param('id', ParseIntPipe) id: number): Promise<Sites> {
    try {
      return await this.sitesService.deleteSiteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException(`Site with ID ${id}`);
      } else if (error instanceof ForbiddenException) {
        throw new CustomForbiddenException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomServiceException('SitesService', 'deleteSiteById');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }
}
