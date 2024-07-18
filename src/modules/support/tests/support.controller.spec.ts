import { Test, TestingModule } from '@nestjs/testing';
import { SupportController } from '../support.controller';
import { Support } from '../../../common/entities/support.entity';
import { Users } from '../../../common/entities/user.entity';
import { MailService } from '../../../common/mail/mail.service';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupportService } from '../support.service';
import { AuthService } from '../../../modules/auth/auth.service';
import { AuthGuard } from '../../../common/gaurds/auth/auth.gaurd';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CustomInternalServerErrorException, CustomUnauthorizedException } from '../../../exceptions/custom-exceptions';

describe('SupportController', () => {
  let supportController: SupportController;
  let supportService: SupportService;
  let userRepository: Repository<Users>;
  let supportRepository: Repository<Support>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportController],
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
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockResolvedValue(true),
          },
        },
        AuthGuard,
      ],
    }).compile();

    supportController = module.get<SupportController>(SupportController);
    supportService = module.get<SupportService>(SupportService);
    mailService = module.get<MailService>(MailService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    supportRepository = module.get<Repository<Support>>(
      getRepositoryToken(Support),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('raiseTicket', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should raise the ticket and mail the appropriate details', async () => {
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

      const mockRaiseTicket = {
        message: 'Ticket raised successfully',
      };

      jest
        .spyOn(supportService, 'raiseTicket')
        .mockResolvedValue(mockRaiseTicket);

      const result = await supportController.raiseTicket(
        mockUserAuth,
        mockRaiseTicketDto,
      );

      expect(result).toBeDefined();
      expect(result.message).toEqual('Ticket raised successfully');
      expect(supportService.raiseTicket).toHaveBeenCalledWith(
        mockRaiseTicketDto,
      );
    });

    it('should throw CustomUnauthorizedException when service throws UnauthorizedException', async () => {
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
        isAdmin: false,
      };

      const mockRaiseTicketDto = {
        ticketSubject: 'New Ticket Subject',
        ticketDescription: 'New Ticket Description',
        senderId: mockUser.id,
      };

      jest.spyOn(supportService, 'raiseTicket').mockRejectedValue(new UnauthorizedException());

      await expect(supportController.raiseTicket(mockUserAuth, mockRaiseTicketDto)).rejects.toThrow(CustomUnauthorizedException);

      expect(supportService.raiseTicket).toHaveBeenCalled();
    });

    it('should throw CustomInternalServerErrorException when service throws Exception', async () => {
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
        isAdmin: false,
      };

      const mockRaiseTicketDto = {
        ticketSubject: 'New Ticket Subject',
        ticketDescription: 'New Ticket Description',
        senderId: mockUser.id,
      };

      jest.spyOn(supportService, 'raiseTicket').mockRejectedValue(new InternalServerErrorException());

      await expect(supportController.raiseTicket(mockUserAuth, mockRaiseTicketDto)).rejects.toThrow(CustomInternalServerErrorException);

      expect(supportService.raiseTicket).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', supportController.raiseTicket);
      expect(guards).toContain(AuthGuard);
    });
  });
});
