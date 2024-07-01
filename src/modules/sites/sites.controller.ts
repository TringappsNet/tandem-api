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
  }from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async createSite(@Body() createSiteDto: CreateSiteDto): Promise<Sites> {
    return this.sitesService.createSite(createSiteDto);
  }

  @Get('createdBy/:createdBy')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async getSitesByCreatedBy(
    @Param('createdBy') createdBy: number,
  ): Promise<any> {
    return this.sitesService.getSitesByCreatedBy(createdBy);
  }

  @Get('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async getDealById(@Param('id') id: number): Promise<Sites> {
    return this.sitesService.getSiteById(id);
  }

  @Put('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateSiteById(
    @Param('id') id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Sites> {
    return this.sitesService.updateSiteById(id, updateSiteDto);
  }

  @Delete('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async deleteSiteById(@Param('id') id: number): Promise<Sites> {
    return this.sitesService.deleteSiteById(id);
  }
}

