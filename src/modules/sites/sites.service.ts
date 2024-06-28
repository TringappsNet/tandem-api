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
        if(createSiteDto.isNew) {
          const dealData = this.sitesRepository.create(createSiteDto);
          const saveData = await this.sitesRepository.save(dealData);
          return saveData;
        } else {
          throw new BadRequestException(`It is not a new site ${createSiteDto.isNew}`);
        }
      }

      

      async getSiteById(id: number): Promise<Sites> {
        const siteId = await this.sitesRepository.findOneBy({ id });
    
        if (!siteId) {
          throw new NotFoundException(`Site with ID ${id} not found`);
        }
    
        return siteId;
      }

      async updateSiteById(
        id: number,
        updateSiteDto: UpdateSiteDto,
      ): Promise<Sites> {
        const existingData = await this.getSiteById(id);
        const updateData = this.sitesRepository.merge(existingData, updateSiteDto);
        return await this.sitesRepository.save(updateData);
      }

      async deleteSiteById(id: number): Promise<Sites> {
        const deleteData = await this.getSiteById(id);
        return await this.sitesRepository.remove(deleteData);
      }

}
