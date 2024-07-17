import { Test, TestingModule } from '@nestjs/testing';
import { BrokerController } from '../broker.controller';
import { BrokerService } from '../broker.service';
import { Deals } from '../../../common/entities/deals.entity';
import { Role } from '../../../common/entities/role.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { Users } from '../../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from '../../../common/gaurds/auth/auth.gaurd';
import { AuthService } from '../../../modules/auth/auth.service';
import { Session } from '../../../common/entities/session.entity';
import { JwtService } from '@nestjs/jwt';
import { InviteUser } from '../../../common/entities/invite.entity';
import { MailService } from '../../../common/mail/mail.service';
import { RoleService } from '../../../modules/user-role/role/role.service';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CustomBadRequestException, CustomConflictException, CustomForbiddenException, CustomInternalServerErrorException, CustomNotFoundException, CustomServiceException, CustomUnprocessableEntityException } from '../../../exceptions/custom-exceptions';

describe('BrokerController', () => {
  let controller: BrokerController;
  let service: BrokerService;
  let authService: AuthService
  let userRepository: Repository<Users>;
  let userRoleRepository: Repository<UserRole>;
  let sessionRepository: Repository<Session>;
  let dealsRepository: Repository<Deals>;
  let roleRepository: Repository<Role>;
  let inviteRepository: Repository<InviteUser>;
  let mailService: MailService;
  let jwtService: JwtService;
  let roleService: RoleService;
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerController],
      providers: [
        BrokerService,
        AuthGuard,
        AuthService,
        MailService,
        JwtService,
        RoleService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Session),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Deals),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(InviteUser),
          useClass: Repository,
        },
        {
          provide: MailerService,
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<BrokerController>(BrokerController);
    service = module.get<BrokerService>(BrokerService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
    sessionRepository = module.get<Repository<Session>>(getRepositoryToken(Session));
    dealsRepository = module.get<Repository<Deals>>(getRepositoryToken(Deals));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    inviteRepository = module.get<Repository<InviteUser>>(getRepositoryToken(InviteUser));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    roleService = module.get<RoleService>(RoleService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should return all the users', async () => {
      const mockUsers = [new Users(), new Users()];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

      const result = await controller.findAll(mockUserAuth);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw CustomNotFoundException when service throws NotFoundException', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new NotFoundException('Brokers'));

      await expect(controller.findAll(mockUserAuth)).rejects.toThrow(CustomNotFoundException);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toContain(AuthGuard);
    });
  });
  
  describe('getAllUsers', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should return all the users with respective deal details', async () => {
      const mockUsers = [{
        user: new Users,
        roleId: 1,
        totalDeals: 1,
        dealsOpened: 1,
        dealsInProgress: 0,
        dealsClosed: 0,
        totalCommission: 0,
      },
      {
        user: new Users,
        roleId: 1,
        totalDeals: 1,
        dealsOpened: 1,
        dealsInProgress: 0,
        dealsClosed: 0,
        totalCommission: 0,
      }];

      jest.spyOn(service, 'findAllUsers').mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers(mockUserAuth);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUsers);
      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('should throw CustomNotFoundException when service throws NotFoundException', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(true);
      jest.spyOn(service, 'findAllUsers').mockRejectedValue(new NotFoundException('The user with the specified role was'));

      await expect(controller.getAllUsers(mockUserAuth)).rejects.toThrow(CustomNotFoundException);

      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('should throw CustomForbiddenException when service throws ForbiddenException', async () => {
      jest.spyOn(service, 'findAllUsers').mockRejectedValue(new ForbiddenException());

      await expect(controller.getAllUsers(mockUserAuth)).rejects.toThrow(CustomForbiddenException);

      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('should throw CustomInternalServerErrorException when service throws CustomServiceException', async () => {
      jest.spyOn(service, 'findAllUsers').mockRejectedValue(new CustomInternalServerErrorException('findAllUsers'));

      await expect(controller.getAllUsers(mockUserAuth)).rejects.toThrow(CustomServiceException);

      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('should throw CustomBadRequestException when service throws Exception', async () => {
      jest.spyOn(service, 'findAllUsers').mockRejectedValue(new BadRequestException());

      await expect(controller.getAllUsers(mockUserAuth)).rejects.toThrow(CustomBadRequestException);

      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toContain(AuthGuard);
    });
  });
  
  describe('updateBroker', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should update broker deatils', async () => {
      const mockUserId = 1;

      const mockUser = new Users();

      const mockUpdateBrokerDto = {
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        lastModifiedBy: 1,
      };

      jest.spyOn(service, 'updateBroker').mockResolvedValue(mockUser);

      const result = await controller.updateBroker(mockUserAuth, mockUserId, mockUpdateBrokerDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(service.updateBroker).toHaveBeenCalled();
    });

    it('should throw CustomNotFoundException when service throws NotFoundException', async () => {
      const mockUserId = 1;

      const mockUpdateBrokerDto = {
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        lastModifiedBy: 1,
      };
      jest.spyOn(service, 'updateBroker').mockRejectedValue(new NotFoundException(`Broker with ID ${mockUserId}`));

      await expect(controller.updateBroker(mockUserAuth, mockUserId, mockUpdateBrokerDto)).rejects.toThrow(CustomNotFoundException);

      expect(service.updateBroker).toHaveBeenCalled();
    });

    it('should throw CustomUnprocessableEntityException when service throws UnprocessableEntityException', async () => {
      const mockUserId = 1;

      const mockUpdateBrokerDto = {
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        lastModifiedBy: 1,
      };
      jest.spyOn(service, 'updateBroker').mockRejectedValue(new UnprocessableEntityException());

      await expect(controller.updateBroker(mockUserAuth, mockUserId, mockUpdateBrokerDto)).rejects.toThrow(CustomUnprocessableEntityException);

      expect(service.updateBroker).toHaveBeenCalled();
    });

    it('should throw CustomConflictException when service throws ConflictException', async () => {
      const mockUserId = 1;

      const mockUpdateBrokerDto = {
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        lastModifiedBy: 1,
      };
      jest.spyOn(service, 'updateBroker').mockRejectedValue(new ConflictException());

      await expect(controller.updateBroker(mockUserAuth, mockUserId, mockUpdateBrokerDto)).rejects.toThrow(CustomConflictException);

      expect(service.updateBroker).toHaveBeenCalled();
    });

    it('should throw CustomBadRequestException when service throws Exception', async () => {
      const mockUserId = 1;

      const mockUpdateBrokerDto = {
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        lastModifiedBy: 1,
      };
      jest.spyOn(service, 'updateBroker').mockRejectedValue(new BadRequestException());

      await expect(controller.updateBroker(mockUserAuth, mockUserId, mockUpdateBrokerDto)).rejects.toThrow(CustomBadRequestException);

      expect(service.updateBroker).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toContain(AuthGuard);
    });
  });
  
  describe('setActiveBroker', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should set broker active', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      };

      const mockUser = {
        updatedBrokerData: new Users(),
        message: `Broker record ${mockUserId} successfully`,
      };

      jest.spyOn(service, 'setActiveBroker').mockResolvedValue(mockUser);

      const result = await controller.setActiveBroker(mockUserAuth, mockUserId, mockSetActiveBrokerDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(service.setActiveBroker).toHaveBeenCalled();
    });

    it('should throw CustomNotFoundException when service throws NotFoundException', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      };

      jest.spyOn(service, 'setActiveBroker').mockRejectedValue(new NotFoundException(`Broker with ID ${mockUserId}`));

      await expect(controller.setActiveBroker(mockUserAuth, mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(CustomNotFoundException);

      expect(service.setActiveBroker).toHaveBeenCalled();
    });

    it('should throw CustomUnprocessableEntityException when service throws UnprocessableEntityException', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      };

      jest.spyOn(service, 'setActiveBroker').mockRejectedValue(new UnprocessableEntityException());

      await expect(controller.setActiveBroker(mockUserAuth, mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(CustomUnprocessableEntityException);

      expect(service.setActiveBroker).toHaveBeenCalled();
    });

    it('should throw CustomConflictException when service throws ConflictException', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      };

      jest.spyOn(service, 'setActiveBroker').mockRejectedValue(new ConflictException());

      await expect(controller.setActiveBroker(mockUserAuth, mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(CustomConflictException);

      expect(service.setActiveBroker).toHaveBeenCalled();
    });

    it('should throw CustomBadRequestException when service throws Exception', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      };

      jest.spyOn(service, 'setActiveBroker').mockRejectedValue(new BadRequestException());

      await expect(controller.setActiveBroker(mockUserAuth, mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(CustomBadRequestException);

      expect(service.setActiveBroker).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toContain(AuthGuard);
    });
  });
  
  describe('deleteBroker', () => {
    const mockUserAuth = { userId: 1, accessToken: 'qwertyuiopasdfghjklzxcvbnm'};

    it('should delete a broker', async () => {
      const mockUserId = 1;

      const mockDeleteBroker = {
        message: 'Broker deleted successfully',
      }

      jest.spyOn(service, 'deleteBroker').mockResolvedValue(mockDeleteBroker);

      const result = await controller.deleteBroker(mockUserAuth, mockUserId);

      expect(result).toBeDefined();
      expect(result).toEqual(mockDeleteBroker);
      expect(service.deleteBroker).toHaveBeenCalled();
    });

    it('should throw CustomNotFoundException when service throws NotFoundException', async () => {
      const mockUserId = 1;

      const mockDeleteBroker = {
        message: 'Broker deleted successfully',
      }

      jest.spyOn(service, 'deleteBroker').mockRejectedValue(new NotFoundException(`Broker with ID ${mockUserId}`));

      await expect(controller.deleteBroker(mockUserAuth, mockUserId)).rejects.toThrow(CustomNotFoundException);

      expect(service.deleteBroker).toHaveBeenCalled();
    });

    it('should throw CustomForbiddenException when service throws ForbiddenException', async () => {
      const mockUserId = 1;

      const mockDeleteBroker = {
        message: 'Broker deleted successfully',
      }

      jest.spyOn(service, 'deleteBroker').mockRejectedValue(new ForbiddenException());

      await expect(controller.deleteBroker(mockUserAuth, mockUserId)).rejects.toThrow(CustomForbiddenException);

      expect(service.deleteBroker).toHaveBeenCalled();
    });

    it('should throw CustomServiceException when service throws InternalServerErrorException', async () => {
      const mockUserId = 1;

      const mockDeleteBroker = {
        message: 'Broker deleted successfully',
      }

      jest.spyOn(service, 'deleteBroker').mockRejectedValue(new InternalServerErrorException());

      await expect(controller.deleteBroker(mockUserAuth, mockUserId)).rejects.toThrow(CustomServiceException);

      expect(service.deleteBroker).toHaveBeenCalled();
    });

    it('should throw CustomBadRequestException when service throws Exception', async () => {
      const mockUserId = 1;

      const mockDeleteBroker = {
        message: 'Broker deleted successfully',
      }

      jest.spyOn(service, 'deleteBroker').mockRejectedValue(new BadRequestException());

      await expect(controller.deleteBroker(mockUserAuth, mockUserId)).rejects.toThrow(CustomBadRequestException);

      expect(service.deleteBroker).toHaveBeenCalled();
    });

    it('should use AuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toContain(AuthGuard);
    });
  });
  
});
