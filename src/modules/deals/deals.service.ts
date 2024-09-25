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
import { MailService } from 'src/common/mail/mail.service';
import { Users } from 'src/common/entities/user.entity';
import {
  listOfDealStatus,
  listOfMilestones,
  mailSubject,
  mailTemplates,
} from 'src/common/constants/deals.constants';
import {
  allowedActions,
  DealsHistory,
} from 'src/common/entities/deals.history.entity';
import { format } from 'date-fns/format';
import { Sites } from 'src/common/entities/sites.entity';
import { SitesService } from '../sites/sites.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals) private dealsRepository: Repository<Deals>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(DealsHistory)
    private dealsHistoryRepository: Repository<DealsHistory>,
    @InjectRepository(Sites) private propertyRepository: Repository<Sites>,
    private mailService: MailService,
    private sitesService: SitesService,
  ) {}

  private previousDeal: Deals;
  private currentDeal: Deals;
  
  dealsHistory = async (state: Deals, action: allowedActions) => {
    const dealsHistory = new DealsHistory();
    dealsHistory.dealId = state.id;
    dealsHistory.activeStep = state.activeStep;
    dealsHistory.status = state.status;
    dealsHistory.brokerName = state.brokerName;
    dealsHistory.brokerId = state.brokerId;
    dealsHistory.propertyName = state.propertyName;
    dealsHistory.propertyId = state.propertyId;
    dealsHistory.dealStartDate = state.dealStartDate;
    dealsHistory.proposalDate = state.proposalDate;
    dealsHistory.loiExecuteDate = state.loiExecuteDate;
    dealsHistory.leaseSignedDate = state.leaseSignedDate;
    dealsHistory.noticeToProceedDate = state.noticeToProceedDate;
    dealsHistory.commercialOperationDate = state.commercialOperationDate;
    dealsHistory.finalCommissionDate = state.finalCommissionDate;
    dealsHistory.finalCommission = state.finalCommission;
    dealsHistory.createdBy = state.createdBy;
    dealsHistory.createdAt = state.createdAt;
    dealsHistory.updatedBy = state.updatedBy;
    dealsHistory.updatedAt = state.updatedAt;
    dealsHistory.date = new Date(Date.now());
    dealsHistory.action = action;

    this.dealsHistoryRepository.save(dealsHistory);
  };

  getInProgressMilestones = async (
    existingActiveStep: number,
    latestActiveStep: number,
    listOfDealStatus: string[],
    listOfMilestones: string[],
    deals: Deals,
  ) => {
    const milestones = [];
    for (let index = existingActiveStep; index < latestActiveStep; index++) {
      const element = listOfDealStatus[index];
      if (
        existingActiveStep === 6 &&
        latestActiveStep === 7 &&
        deals.status === 'Completed'
      ) {
        const dealStatus = deals.status;
        const element = listOfDealStatus[latestActiveStep - 1];
        milestones.push({
          milestones: listOfMilestones[index],
          date: format(
            new Date(deals[element]).toDateString(),
            'MMMM dd, yyyy',
          ),
        });
        break;
      }
      milestones.push({
        milestones: listOfMilestones[index],
        date: format(new Date(deals[element]).toUTCString(), 'MMMM dd, yyyy'),
      });
    }
    return milestones;
  };

  sendMail = async (
    users: Users,
    deals: Deals,
    mailTemplate: string,
    subject: string,
    milestones: any,
  ) => {
    await this.mailService.dealsMail(
      users.email,
      subject,
      {
        name: users.firstName + ' ' + users.lastName,
        dealId: deals.id,
        milestones: milestones,
        dealStatus: deals.status,
        propertyName: deals.propertyName,
        commission: deals.finalCommission,
      },
      mailTemplate,
    );
  };

  async createDeal(createDealDto: CreateDealDto): Promise<Deals> {
    try {
      const dealData = this.dealsRepository.create(createDealDto);
      const saveData = await this.dealsRepository.save(dealData);

      this.dealsHistory(saveData, allowedActions.CREATE);

      const mailTemplate = mailTemplates.deals.update;

      const assignedToRecord = await this.usersRepository.findOne({
        where: { id: createDealDto.brokerId },
      });

      if (saveData.activeStep === 1) {
        const subject = mailSubject.deals.started;
        const mailTemplate = mailTemplates.deals.new;
        this.sendMail(
          assignedToRecord,
          saveData,
          mailTemplate,
          subject,
          format(
            new Date(saveData.dealStartDate).toDateString(),
            'MMMM dd, yyyy',
          ),
        );
      } else if (saveData.activeStep > 1 && saveData.activeStep < 7) {
        const milestones = await this.getInProgressMilestones(
          1,
          saveData.activeStep,
          listOfDealStatus,
          listOfMilestones,
          saveData,
        );
        const subject = mailSubject.deals.updated;
        this.sendMail(
          assignedToRecord,
          saveData,
          mailTemplate,
          subject,
          milestones,
        );
      } else if (saveData.activeStep === 7) {
        const milestones: object = await this.getInProgressMilestones(
          1,
          7,
          listOfDealStatus,
          listOfMilestones,
          saveData,
        );
        const subject = mailSubject.deals.completed;
        this.sendMail(
          assignedToRecord,
          saveData,
          mailTemplate,
          subject,
          milestones,
        );
      }

      saveData.propertyId = await this.sitesService.getSiteById(saveData.propertyId.id)

      return saveData;
    } catch (error) {
      throw error;
    }
  }

  async getAllDeals(): Promise<Deals[]> {
    try {
      const Landlord = await this.dealsRepository.find({
        relations: ['propertyId', 'createdBy', 'updatedBy'],
        select: {
          createdBy: {
            id: true,
          },
          updatedBy: {
            id: true,
          }
        },
      });
      if (Landlord.length === 0) {
        throw new NotFoundException('Deals');
      }
      return Landlord;
    } catch (error) {
      throw error;
    }
  }

  async findAllDealsData(): Promise<any> {
    try {
      const deals = await this.dealsRepository.find({
        relations: ['propertyId'],
      });
      const totalDeals = deals.length;
      const dealsOpened = deals.filter((deal) => deal.activeStep === 1).length;
      const dealsInProgress = deals.filter(
        (deal) => deal.activeStep > 1 && deal.activeStep <= 6,
      ).length;
      const dealsClosed = deals.filter((deal) => deal.activeStep === 7).length;
      const totalPotentialCommission = deals.reduce(
        (sum, deal) => sum + deal.finalCommission,
        0,
      );
      return {
        totalDeals,
        dealsOpened,
        dealsInProgress,
        dealsClosed,
        totalPotentialCommission,
        deals,
      };
    } catch {
      throw new NotFoundException('Deals');
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
        where: { brokerId: assignedTo },
        relations: ['propertyId'],
      });

      if (!deals || deals.length === 0) {
        return new NotFoundException('Deals');
      }

      const totalDeals = deals.length;
      const dealsOpened = deals.filter((deal) => deal.activeStep === 1).length;
      const dealsInProgress = deals.filter(
        (deal) => deal.activeStep > 1 && deal.activeStep <= 6,
      ).length;
      const dealsClosed = deals.filter((deal) => deal.activeStep === 7).length;
      const totalPotentialCommission = deals.reduce(
        (sum, deal) => sum + deal.finalCommission,
        0,
      );

      return {
        totalDeals,
        dealsOpened,
        dealsInProgress,
        dealsClosed,
        totalPotentialCommission,
        deals,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDealById(id: number): Promise<Deals> {
    try {
      const deal = await this.dealsRepository.findOne({
        where: { id },
        relations: {
          updatedBy: false,
          createdBy: false,
          propertyId: true,
        },
      });

      if (!deal) {
        throw new NotFoundException(`Deals with ID ${id}`);
      }

      return deal;
    } catch (error) {
      throw error;
    }
  }

  async areObjectsEqual() {
    const obj1 = { ...this.previousDeal };
    const obj2 = { ...this.currentDeal };
    ['createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'propertyId'].forEach(key => delete obj1[key]);
    ['createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'propertyId'].forEach(key => delete obj2[key]);

    let map1 = new Map(Object.entries(obj1));
    let map2 = new Map(Object.entries(obj2));

    if (map1.size !== map2.size) return false;
    
    for (let [key, value1] of map1) {
      if (!map2.has(key)) return false;
      
      const value2 = map2.get(key);
      
      if (value1 instanceof Date && value2 instanceof Date) {
        if (value1.getTime() !== value2.getTime()) return false;
      } else if (value1 !== value2) {
        return false;
      }
    }
    
    return true;
  }

  async updateDealById(
    id: number,
    updateDealDto: UpdateDealDto,
  ): Promise<Deals> {
    try {
      const mailTemplate = mailTemplates.deals.update;
      const existingDeal = await this.getDealById(id);
      this.previousDeal = { ...existingDeal };
      let existingActiveStep: number = existingDeal.activeStep;
      let latestActiveStep: number = updateDealDto.activeStep;

      const assignedToRecord = await this.usersRepository.findOne({
        where: { id: updateDealDto.brokerId },
      });

      if (!existingDeal) {
        throw new NotFoundException(`Deals with ID ${id}`);
      }

      const updatedDeal = this.dealsRepository.merge(
        existingDeal,
        updateDealDto,
      );
      const savedDeal = await this.dealsRepository.save(updatedDeal);

      const updateDeal = await this.getDealById(id);
      this.currentDeal = { ...updateDeal };
      
      this.dealsHistory(savedDeal, allowedActions.UPDATE);

      const isUpdated = await this.areObjectsEqual()
      if (!isUpdated) {
        if (latestActiveStep > 1 && latestActiveStep <= listOfDealStatus.length) {
          if (existingActiveStep === latestActiveStep) {
            existingActiveStep = 1;
            console.log("Mail Updated");
          }
  
          const milestones = await this.getInProgressMilestones(
            existingActiveStep,
            latestActiveStep,
            listOfDealStatus,
            listOfMilestones,
            updatedDeal,
          );
          let subject = mailSubject.deals.updated;
          if (latestActiveStep === 7) {
            subject = mailSubject.deals.completed;
          }
          this.sendMail(
            assignedToRecord,
            updatedDeal,
            mailTemplate,
            subject,
            milestones,
          );
          
        } else {
          throw new BadRequestException('Invalid Active Step');
        }
      }
      return savedDeal;
    } catch (error) {
      throw error;
    }
  }

  async deleteDealById(id: number): Promise<Deals> {
    try {
      const deal = await this.getDealById(id);

      if (!deal) {
        throw new NotFoundException(`Deals with ID ${id}`);
      }

      this.dealsHistory(deal, allowedActions.DELETE);

      return await this.dealsRepository.remove(deal);
    } catch (error) {
      throw error;
    }
  }

  // async getDealsHistory(id: number): Promise<DealsHistory[]> {
  //   try {
  //     const dealsHistory = await this.dealsHistoryRepository.find({
  //       where: { dealId: id },
  //     })

  //     const dealsHistoryArray = [];
  //     dealsHistory.map((deals) => {
  //       dealsHistoryArray.push(deals.dealState);
  //     })

  //     return dealsHistoryArray;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
