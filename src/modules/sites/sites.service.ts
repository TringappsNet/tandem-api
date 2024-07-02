import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sites } from '../../common/entities/sites.entity';
import { CreateSiteDto } from '../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../common/dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Sites) private sitesRepository: Repository<Sites>,
  ) {}

  async createSite(createSiteDto: CreateSiteDto): Promise<Sites> {
    const site = this.sitesRepository.create(createSiteDto);
    return await this.sitesRepository.save(site);
  }


  
  async getAllSites(): Promise<Sites[]> {
    return await this.sitesRepository.find();
  }

  async getSiteById(id: number): Promise<Sites> {
      const site = await this.sitesRepository.findOne({ where: { id }});

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async updateSite(id: number, updateSiteDto: UpdateSiteDto): Promise<Sites> {
    const site = await this.getSiteById(id);
    Object.assign(site, updateSiteDto);
    return await this.sitesRepository.save(site);
  }

  async deleteSiteById(id: number): Promise<Sites> {
    const site = await this.getSiteById(id);
    return this.sitesRepository.remove(site);
  }
}
