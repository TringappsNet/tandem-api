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
import { SitesService } from './sites.service';
import { ApiTags } from '@nestjs/swagger';
import { Sites } from '../../common/entities/sites.entity';
import { CreateSiteDto } from '../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../common/dto/update-site.dto';
import {
  CustomNotFoundException,
  CustomBadRequestException,
  CustomUnauthorizedException,
  CustomForbiddenException,
  CustomConflictException,
  CustomUnprocessableEntityException,
  CustomServiceException,
  CustomInternalServerErrorException,
} from '../../exceptions/custom-exceptions';

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
      if (error instanceof ConflictException) {
        throw new CustomConflictException('Site');
      } else if (error instanceof CustomBadRequestException) {
        throw new BadRequestException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomInternalServerErrorException('createSite');
      } else {
        throw new CustomBadRequestException();
      }
    }
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  async getSitesByCreatedBy(@Param('createdBy', ParseIntPipe) createdBy: number): Promise<Sites[]> {
    try {
      const sites = await this.sitesService.getSitesByCreatedBy(createdBy);
      if (!sites || sites.length === 0) {
        throw new CustomNotFoundException('Sites');
      }
      return sites;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomNotFoundException('Sites');
      } else if (error instanceof UnauthorizedException) {
        throw new CustomUnauthorizedException();
      } else if (error instanceof InternalServerErrorException) {
        throw new CustomInternalServerErrorException('getSitesByCreatedBy');
      } else {
        throw new CustomBadRequestException();
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
  async updateSiteById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Sites> {
    try {
      return await this.sitesService.updateSiteById(id, updateSiteDto);
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
  async deleteSiteById(@Param('id', ParseIntPipe) id: number): Promise<Sites> {
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
