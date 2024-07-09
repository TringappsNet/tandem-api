import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (createDealDto.isNew) {
      const dealData = this.dealsRepository.create(createDealDto);
      const saveData = await this.dealsRepository.save(dealData);
      return saveData;
    } else {
      throw new BadRequestException();
    }
  }

  
  async getAllDeals(): Promise<Deals[]> {
    const Landlord=await this.dealsRepository.find();
    if (Landlord.length === 0) {
      throw new NotFoundException();
    }
    return Landlord;
  }


  async findAllDealsData(): Promise<any> {
    try {
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
    } catch {
      throw new BadRequestException();
    }

  }
  // async getDealsByCreatedBy(createdBy: number): Promise<Deals[]> {
  //   return await this.dealsRepository.find({
  //     where: { createdBy: { id: createdBy } },
  //   });
  // }

  async getDealsByAssignedTo(assignedTo: number): Promise<any> {
    try {
      const deals = await this.dealsRepository.find({
        where: { assignedTo: assignedTo },
      });

      if (!deals || deals.length === 0) {
        throw new NotFoundException();
      }

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
    } catch {
      throw new BadRequestException();
    }
  }

  async getDealById(id: number): Promise<Deals> {
    try {
      const deal = await this.dealsRepository.findOneBy({ id });

      if (!deal) {
        throw new NotFoundException();
      }

      return deal;
    } catch {
      throw new BadRequestException();
    }
  }


  async updateDealById(
    id: number,
    updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    try {
      const existingDeal = await this.getDealById(id);

      if (!existingDeal) {
        throw new NotFoundException();
      }

      const updatedDeal = this.dealsRepository.merge(existingDeal, updateDealDto);
      return await this.dealsRepository.save(updatedDeal);
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteDealById(id: number): Promise<Deals> {
    try {
      const deal = await this.getDealById(id);

      if (!deal) {
        throw new NotFoundException();
      }

      return await this.dealsRepository.remove(deal);
    } catch {
      throw new BadRequestException();
    }
  }
}
