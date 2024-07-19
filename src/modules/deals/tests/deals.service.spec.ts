import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { DealsService } from '../deals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Deals } from '../../../common/entities/deals.entity';
import { Role } from '../../../common/entities/role.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { Users } from '../../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../../../common/mail/mail.service';
import { HttpException } from '@nestjs/common';
import { listOfDealStatus, listOfMilestones } from '../../../common/constants/deals.constants';

describe('DealsService', () => {
  let service: DealsService;
  let userRepository: Repository<Users>;
  let userRoleRepository: Repository<UserRole>;
  let dealsRepository: Repository<Deals>;
  let roleRepository: Repository<Role>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        MailService,
        {
            provide: MailerService,
            useValue: { send: jest.fn() },
        },
        {
            provide: getRepositoryToken(Users),
            useClass: Repository,
        },
        {
            provide: getRepositoryToken(UserRole),
            useClass: Repository,
        },
        {
            provide: getRepositoryToken(Deals),
            useClass: Repository,
        },
        {
            provide: getRepositoryToken(Role),
            useClass: Repository,
        }
    ],
    }).compile();

    service = module.get<DealsService>(DealsService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
    dealsRepository = module.get<Repository<Deals>>(getRepositoryToken(Deals));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDeal', () => {
    it('should create a deal and sent respective mail', async () => {
        const mockUser = {
            id: 1,
            email: 'test@gmail.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'test',
            lastName: 'test',
            mobile: '1234567890',
            address: 'test address',
            city: 'test city',
            state: 'test state',
            country: 'test country',
            zipcode: '456789',
            resetToken: 'qwertyuiop',
            resetTokenExpires: new Date(Date.now() + 1000),
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            isActive: true,
            hasId: null,
            save: null,
            remove: null,
            softRemove: null,
            recover: null,
            reload: null,
            createdDeals: null,
            updatedDeals: null,
            createdSites: null,
            updatedSites: null,
            lastModifiedBy: 1,
            isAdmin: true,
        };

        const mockCreateDealDto = {
            activeStep: 2,
            status: 'Started',
            brokerName: 'test',
            brokerId: 1,
            propertyName: 'test property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: null,
            leaseSignedDate: null,
            noticeToProceedDate: null,
            commercialOperationDate: null,
            potentialCommissionDate: null,
            potentialCommission: 0,
            createdBy: new Users(),
            isNew: true,
        };

        const newDeal = { ...mockCreateDealDto, id: 1, updatedBy: null, createdAt: new Date(Date.now()), updatedAt: null } as Deals;
        jest.spyOn(dealsRepository, 'create').mockReturnValue(newDeal);
        jest.spyOn(dealsRepository, 'save').mockResolvedValue(newDeal);
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(mailService, 'dealsMail').mockResolvedValue(undefined);
        jest.spyOn(service, 'getInProgressMilestones').mockResolvedValue(undefined);

        const spySendMail = jest.spyOn(service, 'sendMail');

        const result = await service.createDeal(mockCreateDealDto);

        expect(result).toBeDefined();
        expect(result).toEqual(newDeal);
        // expect(spySendMail).toHaveBeenCalledWith(mockUser,
        //     newDeal,
        //     expect.any(String), // mailTemplate
        //     expect.any(String), // subject
        //     expect.any(Array), // milestones
        // );
        expect(spySendMail).toHaveBeenCalled();
        expect(mailService.dealsMail).toHaveBeenCalled();
        expect(service.getInProgressMilestones).toHaveBeenCalledWith(1, mockCreateDealDto.activeStep, listOfDealStatus, listOfMilestones, newDeal);
    });
  });

  describe('getDealById', () => {
    it('should return deal of respective id', async () => {
        const mockDeal = {
            id: 1,
            activeStep: 2,
            status: 'Started',
            brokerName: 'test',
            brokerId: 1,
            propertyName: 'test property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: null,
            leaseSignedDate: null,
            noticeToProceedDate: null,
            commercialOperationDate: null,
            potentialCommissionDate: null,
            potentialCommission: 0,
            createdBy: new Users(),
            isNew: true,
            updatedBy: null, 
            createdAt: new Date(Date.now()), 
            updatedAt: null,
        };

        const mockDealId = 1;

        jest.spyOn(dealsRepository, 'findOneBy').mockResolvedValue(mockDeal);

        const result = await service.getDealById(mockDealId);

        expect(result).toBeDefined();
        expect(result).toEqual(mockDeal);
    });

    it('should throw NotFoundException if deal does not exist', async () => {
        const mockDealId = 1;
  
        jest.spyOn(dealsRepository, 'findOneBy').mockResolvedValue(null);
  
        await expect(service.getDealById(mockDealId)).rejects.toThrow(HttpException);
    });
  });
  
  describe('updateDealById', () => {
    it('should update deal details', async () => {
        const mockUser = {
            id: 1,
            email: 'test@gmail.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'test',
            lastName: 'test',
            mobile: '1234567890',
            address: 'test address',
            city: 'test city',
            state: 'test state',
            country: 'test country',
            zipcode: '456789',
            resetToken: 'qwertyuiop',
            resetTokenExpires: new Date(Date.now() + 1000),
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            isActive: true,
            hasId: null,
            save: null,
            remove: null,
            softRemove: null,
            recover: null,
            reload: null,
            createdDeals: null,
            updatedDeals: null,
            createdSites: null,
            updatedSites: null,
            lastModifiedBy: 1,
            isAdmin: true,
        };
        
        const mockDeal = {
            id: 1,
            activeStep: 1,
            status: 'Started',
            brokerName: 'test',
            brokerId: 1,
            propertyName: 'test property',
            dealStartDate: new Date(Date.now()),
            proposalDate: null,
            loiExecuteDate: null,
            leaseSignedDate: null,
            noticeToProceedDate: null,
            commercialOperationDate: null,
            potentialCommissionDate: null,
            potentialCommission: 0,
            createdBy: new Users(),
            isNew: true,
            updatedBy: null, 
            createdAt: new Date(Date.now()), 
            updatedAt: null,
        };

        const mockDealId = 1;

        const mockUpdateDealDto = {
            activeStep: 2,
            status: 'Started',
            brokerName: 'test',
            brokerId: 1,
            propertyName: 'test property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: null,
            leaseSignedDate: null,
            noticeToProceedDate: null,
            commercialOperationDate: null,
            potentialCommissionDate: null,
            potentialCommission: 0,
            updatedBy: new Users(),
        };

        const updatedDeal = { ...mockDeal as Deals, ...mockUpdateDealDto };
        jest.spyOn(service, 'getDealById').mockResolvedValue(mockDeal);
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(dealsRepository, 'merge').mockReturnValue(updatedDeal);
        jest.spyOn(dealsRepository, 'save').mockResolvedValue(updatedDeal);
        jest.spyOn(mailService, 'dealsMail').mockResolvedValue(undefined);

        const spySendMail = jest.spyOn(service, 'sendMail');

        const result = await service.updateDealById(mockDealId, mockUpdateDealDto);

        expect(result).toBeDefined();
        expect(spySendMail).toHaveBeenCalled();
    });
  });
  
  describe('deleteDealById', () => {
    it('should delete a deal', async () => {
        const mockDealId = 1;

        const mockDeal = {
            id: 1,
            activeStep: 2,
            status: 'Started',
            brokerName: 'test',
            brokerId: 1,
            propertyName: 'test property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: null,
            leaseSignedDate: null,
            noticeToProceedDate: null,
            commercialOperationDate: null,
            potentialCommissionDate: null,
            potentialCommission: 0,
            createdBy: new Users(),
            isNew: true,
            updatedBy: null, 
            createdAt: new Date(Date.now()), 
            updatedAt: null,
        };

        jest.spyOn(service, 'getDealById').mockResolvedValue(mockDeal);
        jest.spyOn(dealsRepository, 'remove').mockResolvedValue(mockDeal);

        const result = await service.deleteDealById(mockDealId);

        expect(result).toBeDefined();
        expect(result).toEqual(mockDeal);
        expect(service.getDealById).toHaveBeenCalledWith(mockDealId);
    });

    it('should return NotFoundException if invalid deal id', async () => {
        const mockDealId = 1;

        jest.spyOn(service, 'getDealById').mockResolvedValue(null);

        await expect(service.deleteDealById(mockDealId)).rejects.toThrow(HttpException);
    });
  });
  
});
