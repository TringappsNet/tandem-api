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
        throw new NotFoundException(`User with ID ${createSiteDto.createdBy.id} not found`);
      }
      const site = this.sitesRepository.create({ ...createSiteDto, createdBy: user, updatedBy: user });
      return this.sitesRepository.save(site);
    } else {
      throw new BadRequestException(`It is not a new site ${createSiteDto.isNew}`);
    }
  }

  async getSitesByCreatedBy(createdBy: number): Promise<Sites[]> {
    return await this.sitesRepository.find({
      where: { createdBy: { id: createdBy } },
    });
  }

  async getSiteById(id: number): Promise<Sites> {
    const site = await this.sitesRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async updateSiteById(id: number, updateSiteDto: UpdateSiteDto): Promise<Sites> {
    const site = await this.getSiteById(id);
    const user = await this.usersRepository.findOne({ where: { id: updateSiteDto.updatedBy.id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${updateSiteDto.updatedBy.id} not found`);
    }
    const updatedSite = this.sitesRepository.merge(site, updateSiteDto, { updatedBy: user });
    return this.sitesRepository.save(updatedSite);
  }

  async deleteSiteById(id: number): Promise<Sites> {
    const site = await this.getSiteById(id);
    return this.sitesRepository.remove(site);
  }
}
