import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from '../support.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from '../../../common/entities/user.entity';
import { Support } from '../../../common/entities/support.entity';
import { MailService } from '../../../common/mail/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException } from '@nestjs/common';

describe('SupportService', () => {
  let supportService: SupportService;
  let userRepository: Repository<Users>;
  let supportRepository: Repository<Support>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,
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
          provide: getRepositoryToken(Support),
          useClass: Repository,
        },
      ],
    }).compile();

    supportService = module.get<SupportService>(SupportService);
    mailService = module.get<MailService>(MailService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    supportRepository = module.get<Repository<Support>>(getRepositoryToken(Support));
  });

  it('should be defined', () => {
    expect(supportService).toBeDefined();
  });

  describe('raiseTicket', () => {
    it('should sent the ticket mail successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        resetToken: null,
        resetTokenExpires: new Date(Date.now()),
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
        lastModifiedBy: null,
      };

      const mockRaiseTicketDto = {
        ticketSubject: 'New Ticket Subject',
        ticketDescription: 'New Ticket Description',
        senderId: mockUser.id,
      };

      const mockSupport = new Support();
      mockSupport.id = 1;
      mockSupport.ticketSubject = mockRaiseTicketDto.ticketSubject;
      mockSupport.ticketDescription = mockRaiseTicketDto.ticketDescription;
      mockSupport.ticketStatus = 'New Ticket Status';
      mockSupport.ticketPriority = 'New Ticket Priority';
      mockSupport.createdAt = new Date(Date.now());
      mockSupport.updatedAt = new Date(Date.now());
      mockSupport.createdBy = mockRaiseTicketDto.senderId;
      mockSupport.updatedBy = null;

      jest.spyOn(supportRepository, 'save').mockResolvedValue(mockSupport);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      
      const spySupportMail = jest.spyOn(mailService, 'supportMail').mockResolvedValue(undefined);

      const result = await supportService.raiseTicket(mockRaiseTicketDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Ticket raised successfully');
      expect(supportRepository.save).toHaveBeenCalled();
      expect(spySupportMail).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if not a registered user', async () => {    
        const mockRaiseTicketDto = {
            ticketSubject: 'New Ticket Subject',
            ticketDescription: 'New Ticket Description',
            senderId: 2,
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

        await expect(supportService.raiseTicket(mockRaiseTicketDto)).rejects.toThrow(Error);
    });

    it('should throw UnauthorizedException if a inactive user', async () => {   
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'test',
            lastName: 'test',
            mobile: '1234567890',
            address: 'test address',
            city: 'test city',
            state: 'test state',
            country: 'test country',
            zipcode: '456789',
            resetToken: null,
            resetTokenExpires: new Date(Date.now()),
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            isActive: false,
            hasId: null,
            save: null,
            remove: null,
            softRemove: null,
            recover: null,
            reload: null,
            createdDeals: null,
            updatedDeals: null,
            lastModifiedBy: null,
        };

        const mockRaiseTicketDto = {
            ticketSubject: 'New Ticket Subject',
            ticketDescription: 'New Ticket Description',
            senderId: 1,
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

        await expect(supportService.raiseTicket(mockRaiseTicketDto)).rejects.toThrow(Error);
    });

    it('should throw UnauthorizedException if unverified email', async () => {   
        const mockUser = {
            id: 1,
            email: '',
            password: await bcrypt.hash('password123', 10),
            firstName: 'test',
            lastName: 'test',
            mobile: '1234567890',
            address: 'test address',
            city: 'test city',
            state: 'test state',
            country: 'test country',
            zipcode: '456789',
            resetToken: null,
            resetTokenExpires: new Date(Date.now()),
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
            lastModifiedBy: null,
        };

        const mockRaiseTicketDto = {
            ticketSubject: 'New Ticket Subject',
            ticketDescription: 'New Ticket Description',
            senderId: 1,
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

        await expect(supportService.raiseTicket(mockRaiseTicketDto)).rejects.toThrow(Error);
    });
  });
});
