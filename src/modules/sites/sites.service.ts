import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sites } from '../../common/entities/sites.entity';
import { CreateSiteDto } from '../../common/dto/create-site.dto';
import { UpdateSiteDto } from '../../common/dto/update-site.dto';
import { Users } from '../../common/entities/user.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Sites) private sitesRepository: Repository<Sites>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async createSite(createSiteDto: CreateSiteDto): Promise<Sites> {
    if (createSiteDto.isNew) {
      const user = await this.usersRepository.findOne({ where: { id: createSiteDto.createdBy.id } });
      if (!user) {
        throw new NotFoundException(); 
      }
      const site = this.sitesRepository.create({ ...createSiteDto, createdBy: user, updatedBy: user });
      return this.sitesRepository.save(site);
    } else {
      throw new BadRequestException(); 
    }
  }

  async getSitesByCreatedBy(createdBy: number): Promise<Sites[]> {
    const sites = await this.sitesRepository.find({
      where: { createdBy: { id: createdBy } },
    });

    if (sites.length === 0) {
      throw new NotFoundException(); 
    }

    return sites;
  }

  async getSiteById(id: number): Promise<Sites> {
    const site = await this.sitesRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });

    if (!site) {
      throw new NotFoundException(); 
    }

    return site;
  }

  async updateSiteById(id: number, updateSiteDto: UpdateSiteDto): Promise<Sites> {
    const site = await this.getSiteById(id);
    const user = await this.usersRepository.findOne({ where: { id: updateSiteDto.updatedBy.id } });
    if (!user) {
      throw new NotFoundException(); 
    }
    const updatedSite = this.sitesRepository.merge(site, updateSiteDto, { updatedBy: user });
    return this.sitesRepository.save(updatedSite);
  }

  async deleteSiteById(id: number): Promise<Sites> {
    const site = await this.getSiteById(id);
    return this.sitesRepository.remove(site);
  }
}
