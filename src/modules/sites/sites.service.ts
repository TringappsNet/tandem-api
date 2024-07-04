import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const { addressline1} = createSiteDto;
    const existingSite = await this.sitesRepository.findOne({
      where: { addressline1},
    });
    if (existingSite) {
      throw new ConflictException();
    }

    const site = this.sitesRepository.create(createSiteDto);
    return await this.sitesRepository.save(site);
  }  


  
  async getAllSites(): Promise<Sites[]> {
    const sites = await this.sitesRepository.find();
    if (sites.length === 0) {
      throw new NotFoundException();
    }
    return sites;
  }

  async getSiteById(id: number): Promise<Sites> {
      const site = await this.sitesRepository.findOne({ where: { id }});

    if (!site) {
      throw new NotFoundException();
    }

    return site;
  }

  async updateSite(id: number, updateSiteDto: UpdateSiteDto): Promise<Sites> {
    const site = await this.getSiteById(id);
    if (!site) {
      throw new NotFoundException(); 
    }
    Object.assign(site, updateSiteDto);
    return await this.sitesRepository.save(site);
  }

  async deleteSiteById(id: number): Promise<Sites> {
    const site = await this.getSiteById(id);
    if (!site) {
      throw new NotFoundException(); 
    }
    return this.sitesRepository.remove(site);
  }
}
