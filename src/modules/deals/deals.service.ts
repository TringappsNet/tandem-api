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
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/common/mail/mail.service';
import { Users } from 'src/common/entities/user.entity';
// import { sendDealsEmail } from 'src/common/methods/smtp.deals';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals) private dealsRepository: Repository<Deals>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private mailService: MailService,
  ) {}

  async createDeal(createDealDto: CreateDealDto): Promise<Deals> {
    if (createDealDto.isNew) {
      const dealData = this.dealsRepository.create(createDealDto);
      const saveData = await this.dealsRepository.save(dealData);
      if(saveData.activeStep === 1){
        await this.mailService.dealsMail('test@example.com', 'Deal Has Been Started', {});
      }
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
      const existingActiveStep = existingDeal.activeStep;
      const latestActiveStep = updateDealDto.activeStep;
      const listOfDealStatus = [
        'dealStartDate', 'proposalDate', 'loiExecuteDate', 'leaseSignedDate', 
        'noticeToProceedDate', 'commercialOperationDate', 'potentialCommissionDate'
      ]
      // const assignedToRecord = await this.usersRepository.findOne({
      //   where: { id: updateDealDto.updatedBy }
      // })

      if (!existingDeal) {
        throw new NotFoundException();
      }

      const updatedDeal = this.dealsRepository.merge(existingDeal, updateDealDto);
      const savedDeal = null// await this.dealsRepository.save(updatedDeal);

      var dealStatus: string = 'In-Progress';
      if (latestActiveStep > 1 && latestActiveStep <= listOfDealStatus.length) {
        if (existingActiveStep === latestActiveStep) {
          console.log('Deal Completed');
          // await this.mailService.dealsMail()
          return savedDeal;
        }
        const milestones = []
        for (let index = existingActiveStep; index < latestActiveStep; index++) {
          const element = listOfDealStatus[index];
          if(latestActiveStep === 7 && updatedDeal.status === 'Completed') {
            dealStatus = updatedDeal.status;
            const element = listOfDealStatus[latestActiveStep-1];
            milestones.push({milestones: [element, updatedDeal[element]]});
            break;
          }
          milestones.push({milestones: [element, updatedDeal[element]]});
        }
        console.log(milestones, dealStatus);
        return savedDeal;
      } else {
        throw new BadRequestException('Invalid Active Step');
      }
    } catch (error) {
      throw error;
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
