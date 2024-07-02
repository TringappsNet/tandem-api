import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from '../support.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from 'src/common/entities/user.entity';
import { Support } from 'src/common/entities/support.entity';
import { MailService } from 'src/common/mail/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'node:test';

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
      };

      const mockRaiseTicketDto = {
        email: 'test@example.com',
        ticketSubject: 'New Ticket Subject',
        ticketDescription: 'New Ticket Description',
        createdBy: mockUser,
      }

      const mockSupport = new Support();
      mockSupport.id = 1;
      mockSupport.ticketSubject = 'New Ticket Subject';
      mockSupport.ticketDescription = 'New Ticket Description';
      mockSupport.ticketStatus = 'New Ticket Status';
      mockSupport.ticketPriority = 'New Ticket Priority';
      mockSupport.createdAt = new Date(Date.now());
      mockSupport.updatedAt = new Date(Date.now());
      mockSupport.createdBy = mockUser;
      mockSupport.updatedBy = mockUser;

      jest.spyOn(supportRepository, 'save').mockResolvedValue(mockSupport);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await supportService.raiseTicket(mockRaiseTicketDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Ticket raised successfully');
    });
  });
});
