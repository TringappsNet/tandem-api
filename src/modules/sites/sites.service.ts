
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
    try {
      const { addressline1} = createSiteDto;
      const existingSite = await this.sitesRepository.findOne({
        where: { addressline1},
      });
      if (existingSite) {
        throw new ConflictException();
      }
      const site = this.sitesRepository.create(createSiteDto);
      return await this.sitesRepository.save(site);
    } catch (error) {
      throw error;
    }
  }  



  async getAllSites(): Promise<Sites[]> {
    try {
      const sites = await this.sitesRepository.find();
      if (sites.length === 0) {
        throw new NotFoundException('Sites');
      }
      return sites;
    } catch (error) {
      throw error;
    }
  }

  async getSiteById(id: number): Promise<Sites> {
    try {
      const site = await this.sitesRepository.findOne({ where: { id } });
      if (!site) {
        throw new NotFoundException(`Sites with ID ${id}`);
      }
      return site;
    } catch (error) {
      throw error;
    }
  }

  async updateSite(id: number, updateSiteDto: UpdateSiteDto): Promise<Sites> {
    try {
      const site = await this.getSiteById(id);
      if (!site) {
        throw new NotFoundException(`Sites with ID ${id}`); 
      }
      Object.assign(site, updateSiteDto);
      return await this.sitesRepository.save(site);
    } catch (error) {
      throw error;
    }
  }

  async deleteSiteById(id: number): Promise<Sites> {
    try {
      const site = await this.getSiteById(id);
      if (!site) {
        throw new NotFoundException(`Sites with ID ${id}`); 
      }
      return this.sitesRepository.remove(site);
    } catch (error) {
      throw error;
    }
  }
}
