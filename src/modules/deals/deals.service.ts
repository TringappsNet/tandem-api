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
import { listOfDealStatus, listOfMilestones } from 'src/common/constants/deals.constants';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals) private dealsRepository: Repository<Deals>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private mailService: MailService,
  ) {}

  getInProgressMilestones = async (existingActiveStep: number, latestActiveStep: number, listOfDealStatus: string[], listOfMilestones: string[], deals: Deals) => {
    const milestones = []
    for (let index = existingActiveStep; index < latestActiveStep; index++) {
      const element = listOfDealStatus[index];
      if(latestActiveStep === 7 && deals.status === 'Completed') {
        let dealStatus = deals.status;
        const element = listOfDealStatus[latestActiveStep-1];
        milestones.push({milestones: listOfMilestones[index], date: new Date(deals[element]).toDateString() });
        break;
      }
      milestones.push({milestones: listOfMilestones[index], date: new Date(deals[element]).toUTCString() });
    }
    console.log(milestones);
    return milestones;
  };

  sendMail = async (users: Users, deals: Deals, mailTemplate: string, subject: string, milestones: any) => {
    await this.mailService.dealsMail(users.email, subject, {
      name: users.firstName + " " + users.lastName,
      dealId: deals.id,
      milestones: milestones,
      dealStatus: deals.status,
      propertyName: deals.propertyName,
      commission: deals.potentialCommission,
    },
    mailTemplate,
  );
  };

  async createDeal(createDealDto: CreateDealDto): Promise<Deals> {
    try {
        const dealData = this.dealsRepository.create(createDealDto);
        const saveData = await this.dealsRepository.save(dealData);
        let mailTemplate = './deals';
  
        const assignedToRecord = await this.usersRepository.findOne({
          where: { id: createDealDto.brokerId }
        });

        if(saveData.activeStep === 1){
          const subject = 'Deal Has Been Created';
          let mailTemplate = './newDeal';
          this.sendMail(assignedToRecord, saveData, mailTemplate, subject, new Date(saveData.dealStartDate).toDateString());
        } else if (saveData.activeStep > 1 && saveData.activeStep < 7) {
          const milestones = await this.getInProgressMilestones(1, saveData.activeStep, listOfDealStatus, listOfMilestones, saveData);
          const subject = 'Current Status of the Deal';
          this.sendMail(assignedToRecord, saveData, mailTemplate, subject, milestones);
        } else if (saveData.activeStep === 7){
          const milestones: object = await this.getInProgressMilestones(1, 7, listOfDealStatus, listOfMilestones, saveData);
          const subject = 'Deal Has Been Completed';
          this.sendMail(assignedToRecord, saveData, mailTemplate, subject, milestones);
        }

        return saveData;
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
      const mailTemplate = './deals';
      const existingDeal = await this.getDealById(id);
      const existingActiveStep = existingDeal.activeStep;
      const latestActiveStep = updateDealDto.activeStep;

      const assignedToRecord = await this.usersRepository.findOne({
        where: { id: updateDealDto.brokerId }
      })

      if (!existingDeal) {
        throw new NotFoundException();
      }

      const updatedDeal = this.dealsRepository.merge(existingDeal, updateDealDto);
      const savedDeal = await this.dealsRepository.save(updatedDeal);

      // var dealStatus: string = 'In-Progress';
      if (latestActiveStep > 1 && latestActiveStep <= listOfDealStatus.length) {
        if (existingActiveStep === latestActiveStep) {
          throw new BadRequestException('Invalid Operations on Deals Tracker');
        }
        const milestones = await this.getInProgressMilestones(existingActiveStep, latestActiveStep, listOfDealStatus, listOfMilestones, updatedDeal);
        var subject = 'Current Status of the Deal'
        if (latestActiveStep === 7) {
          subject = 'Deal Has Been Completed';
        }
        this.sendMail(assignedToRecord, updatedDeal, mailTemplate, subject, milestones);
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
