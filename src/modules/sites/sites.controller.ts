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
    return this.sitesService.createSite(createSiteDto);
  }
  @Get()
  async getAllSites(): Promise<Sites[]> {
    return this.sitesService.getAllSites();
  }

  @Get('site/:id')
  @HttpCode(HttpStatus.OK)
  async getSiteById(@Param('id') id: number): Promise<Sites> {
    return this.sitesService.getSiteById(id);
  }

  @Put('site/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async updateSiteById(
    @Param('id') id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<Sites> {
    return this.sitesService.updateSite(id, updateSiteDto);
  }

  @Delete('site/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSiteById(@Param('id') id: number): Promise<Sites> {
    return this.sitesService.deleteSiteById(id);
  }
}
