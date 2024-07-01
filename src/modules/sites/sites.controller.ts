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
  ParseIntPipe,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { ApiTags } from '@nestjs/swagger';
import { Sites } from '../../common/entities/sites.entity';
import { CreateSiteDto } from '../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../common/dto/update-site.dto';

@ApiTags('Sites')
@Controller('api/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post('site')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async createSite(@Body() createSiteDto: CreateSiteDto): Promise<Sites> {
    try {
      return await this.sitesService.createSite(createSiteDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException('Failed to create site');
      }
    }
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  async getSitesByCreatedBy(@Param('createdBy', ParseIntPipe) createdBy: number): Promise<Sites[]> {
    try {
      const sites = await this.sitesService.getSitesByCreatedBy(createdBy);
      if (!sites || sites.length === 0) {
        throw new NotFoundException('No sites found for the specified creator');
      }
      return sites;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException('Failed to retrieve sites');
      }
    }
  }

  @Get('site/:id')
  @HttpCode(HttpStatus.OK)
  async getSiteById(@Param('id', ParseIntPipe) id: number): Promise<Sites> {
    try {
      return await this.sitesService.getSiteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException('Failed to retrieve site');
      }
    }
  }
  
  @Put('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateSiteById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Sites> {
    try {
      return await this.sitesService.updateSiteById(id, updateSiteDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException('Failed to update site');
      }
    }
  }

  @Delete('site/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSiteById(@Param('id', ParseIntPipe) id: number): Promise<Sites> {
    try {
      return await this.sitesService.deleteSiteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Site with ID ${id} does not exist`);
      } else {
        throw new BadRequestException('Failed to delete site');
      }
    }
  }
}
