import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from 'src/common/dto/create-deal.dto';
import { UpdateDealDto } from 'src/common/dto/update-deal.dto';
import { Deals } from 'src/common/entities/deals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals) private dealsRepository: Repository<Deals>,
  ) {}

  async createDeal(createDealDto: CreateDealDto): Promise<Deals> {
    const dealData = this.dealsRepository.create(createDealDto);
    return await this.dealsRepository.save(dealData);
  }

  async getAllDeals(): Promise<Deals[]> {
    return await this.dealsRepository.find();
  }

  async getDealsByCreatedBy(createdBy: number): Promise<Deals[]> {
    return await this.dealsRepository.find({
      where: { createdBy: { id: createdBy } },
    });
  }

  async getDealById(id: number): Promise<Deals> {
    const dealId = await this.dealsRepository.findOneBy({ id });

    if (!dealId) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    return dealId;
  }

  async updateDealById(
    id: number,
    updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    const existingData = await this.getDealById(id);
    const updateData = this.dealsRepository.merge(existingData, updateDealDto);
    return await this.dealsRepository.save(updateData);
  }

  async deleteDealById(id: number): Promise<Deals> {
    const deleteData = await this.getDealById(id);
    return await this.dealsRepository.remove(deleteData);
  }
}
