import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from '../../common/dto/create-deal.dto';
import { UpdateDealDto } from '../../common/dto/update-deal.dto';
import { Deals } from '../../common/entities/deals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals) private dealsRepository: Repository<Deals>,
  ) {}

  async createDeal(createDealDto: CreateDealDto): Promise<Deals> {
    if(createDealDto.isNew) {
      const dealData = this.dealsRepository.create(createDealDto);
      const saveData = await this.dealsRepository.save(dealData);
      return saveData;
    } else {
      throw new BadRequestException(`It is not a new deal ${createDealDto.isNew}`);
    }
  }

  async getAllDeals(): Promise<any> {
    const deals = await this.dealsRepository.find();
    const totalDeals = deals.length;
    const dealsOpened = deals.filter((deal) => deal.activeStep === 1).length;
    const dealsInProgress = deals.filter(
      (deal) => deal.activeStep > 1 && deal.activeStep <= 6,
    ).length;
    const dealsClosed = deals.filter((deal) => deal.activeStep === 7).length;
    const totalCommission = deals.reduce(
      (sum, deal) => sum + deal.potentialCommission,
      0,
    );
    return {
      totalDeals,
      dealsOpened,
      dealsInProgress,
      dealsClosed,
      totalCommission,
      deals,
    };
  }

  // async getDealsByCreatedBy(createdBy: number): Promise<Deals[]> {
  //   return await this.dealsRepository.find({
  //     where: { createdBy: { id: createdBy } },
  //   });
  // }

  async getDealsByCreatedBy(createdBy: number): Promise<any> {
    const deals = await this.dealsRepository.find({
      where: { createdBy: { id: createdBy } },
    });

    const totalDeals = deals.length;
    const dealsOpened = deals.filter((deal) => deal.activeStep === 1).length;
    const dealsInProgress = deals.filter(
      (deal) => deal.activeStep > 1 && deal.activeStep <= 6,
    ).length;
    const dealsClosed = deals.filter((deal) => deal.activeStep === 7).length;
    const totalCommission = deals.reduce(
      (sum, deal) => sum + deal.potentialCommission,
      0,
    );

    return {
      totalDeals,
      dealsOpened,
      dealsInProgress,
      dealsClosed,
      totalCommission,
      deals,
    };
  }

  async getDealById(id: number): Promise<Deals> {
    const deal = await this.dealsRepository.findOneBy({ id });
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return deal;
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
