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
    try {
      if (createDealDto.isNew) {
        const dealData = this.dealsRepository.create(createDealDto);
        const saveData = await this.dealsRepository.save(dealData);
        const mailTemplate = './newDeal'
  
        const assignedToRecord = await this.usersRepository.findOne({
          where: { id: createDealDto.brokerId }
        })
        if(saveData.activeStep === 1){
          await this.mailService.dealsMail(assignedToRecord.email, 'Deal Has Been Started', {
            name: assignedToRecord.firstName + " " + assignedToRecord.lastName,
            dealId: saveData.id,
            date: new Date(saveData.dealStartDate).toDateString(),
            dealStatus: saveData.status,
            propertyName: saveData.propertyName,
            commission: saveData.potentialCommission,
          },
          mailTemplate,
        );
        }
        return saveData;
      } else {
        throw new BadRequestException('Already this deal exists');
      }
    } catch (error) {
      throw error;
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
      const mailTemplate = './deals'
      const existingDeal = await this.getDealById(id);
      const existingActiveStep = existingDeal.activeStep;
      const latestActiveStep = updateDealDto.activeStep;
      const listOfDealStatus = [
        'dealStartDate', 'proposalDate', 'loiExecuteDate', 'leaseSignedDate', 
        'noticeToProceedDate', 'commercialOperationDate', 'potentialCommissionDate'
      ]
      const listOfMilestones = [
        'Deal Start', 'Proposal', 'LOI Execution', 'Lease Signed',
        'Notice To Proceed', 'Commercial Operation', 'Potential Commission'
      ]
      const assignedToRecord = await this.usersRepository.findOne({
        where: { id: updateDealDto.brokerId }
      })

      if (!existingDeal) {
        throw new NotFoundException();
      }

      const updatedDeal = this.dealsRepository.merge(existingDeal, updateDealDto);
      const savedDeal = await this.dealsRepository.save(updatedDeal);

      var dealStatus: string = 'In-Progress';
      if (latestActiveStep > 1 && latestActiveStep <= listOfDealStatus.length) {
        if (existingActiveStep === latestActiveStep) {
          console.log('Deal Completed');
          dealStatus = updatedDeal.status;
          await this.mailService.dealsMail(assignedToRecord.email, 'Milestones Update', {
            name: assignedToRecord.firstName + " " + assignedToRecord.lastName,
            dealId: existingDeal.id,
            milestones: {milestones:listOfMilestones[-1], date: new Date(updatedDeal[listOfDealStatus[-1]]).toDateString()},
            dealStatus: dealStatus,
            propertyName: updatedDeal.propertyName,
            commission: updatedDeal.potentialCommission,
          },
          mailTemplate,
        )
          return savedDeal;
        }
        const milestones = []
        for (let index = existingActiveStep; index < latestActiveStep; index++) {
          const element = listOfDealStatus[index];
          if(latestActiveStep === 7 && updatedDeal.status === 'Completed') {
            dealStatus = updatedDeal.status;
            const element = listOfDealStatus[latestActiveStep-1];
            milestones.push({milestones: listOfMilestones[index], date: new Date(updatedDeal[element]).toDateString() });
            break;
          }
          milestones.push({milestones: listOfMilestones[index], date: new Date(updatedDeal[element]).toUTCString() });
        }
        console.log(milestones, dealStatus);
        await this.mailService.dealsMail(assignedToRecord.email, 'Milestones Update', {
          name: assignedToRecord.firstName + " " + assignedToRecord.lastName,
          dealId: existingDeal.id,
          milestones: milestones,
          dealStatus: dealStatus,
          propertyName: updatedDeal.propertyName,
          commission: updatedDeal.potentialCommission,
        },
        mailTemplate,
      )
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
