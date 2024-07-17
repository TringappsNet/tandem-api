import { Test, TestingModule } from '@nestjs/testing';
import { BrokerService } from '../broker.service';
import { Repository } from 'typeorm';
import { Users } from '../../../common/entities/user.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { Deals } from '../../../common/entities/deals.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../common/entities/role.entity';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';

describe('BrokerService', () => {
  let service: BrokerService;
  let userRepository: Repository<Users>;
  let userRoleRepository: Repository<UserRole>;
  let dealsRepository: Repository<Deals>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrokerService,
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

    service = module.get<BrokerService>(BrokerService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
    dealsRepository = module.get<Repository<Deals>>(getRepositoryToken(Deals));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => { 
      it('should return all the users in a object', async () => {
        const mockUser = [{
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
          createdSites: null,
          updatedSites: null,
          lastModifiedBy: 1,
          isAdmin: false,
        },
        {
          id: 2,
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
          createdSites: null,
          updatedSites: null,
          lastModifiedBy: 2,
          isAdmin: false,
        }];
        
        jest.spyOn(userRepository, 'find').mockResolvedValue(mockUser);

        const result = await service.findAll();

        const filteredUser = mockUser.map((removeSensitiveData) => {
          const {
            password,
            createdAt,
            updatedAt,
            isActive,
            resetToken,
            resetTokenExpires,
            ...userObject
          } = removeSensitiveData;
          return userObject;
        });

        expect(result).toBeDefined();
        expect(result).toEqual(filteredUser);
      });

      it('should return NotFoundException if no users available', async () => {
        jest.spyOn(userRepository, 'find').mockResolvedValue(null);

        await expect(service.findAll()).rejects.toThrow(HttpException);
      });
  });
  
  describe('findAllUsers', () => {
    it('should return a user with deals details', async () => {
 
        const mockUser = new Users();
        mockUser.id = 1;
        mockUser.email = 'test@gmail.com';
        mockUser.password = await bcrypt.hash('password123', 10);
        mockUser.firstName = 'test';
        mockUser.lastName = 'test';
        mockUser.mobile = '1234567890';
        mockUser.address = 'test address';
        mockUser.city = 'test city';
        mockUser.state = 'test state';
        mockUser.country = 'test country';
        mockUser.zipcode = '456789';
        mockUser.resetToken = null;
        mockUser.resetTokenExpires = new Date(Date.now());
        mockUser.createdAt = new Date(Date.now());
        mockUser.updatedAt = new Date(Date.now());
        mockUser.isActive = true;
        mockUser.hasId = null;
        mockUser.save = null;
        mockUser.remove = null;
        mockUser.softRemove = null;
        mockUser.recover = null;
        mockUser.reload = null;
        mockUser.createdDeals = null;
        mockUser.updatedDeals = null;

        const mockRole = new Role();
        mockRole.id = 2;
        mockRole.roleName = 'broker';
        mockRole.createdAt = new Date(Date.now());
        mockRole.updatedAt = new Date(Date.now());
        mockRole.description = 'broker-role';
        mockRole.createdBy = 1;
        mockRole.updatedBy = 1;

        const mockUserRole = new UserRole();
        mockUserRole.id = 1;
        mockUserRole.userId = mockUser.id;
        mockUserRole.roleId = mockRole.id;
        mockUserRole.user = mockUser;

        const mockDeals = [{
            id: 1,
            activeStep: 1,
            status: 'Started',
            brokerName: 'broker',
            brokerId: 1,
            propertyName: 'broker property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: new Date(Date.now()),
            leaseSignedDate: new Date(Date.now()),
            noticeToProceedDate: new Date(Date.now()),
            commercialOperationDate: new Date(Date.now()),
            potentialCommissionDate: new Date(Date.now()),
            potentialCommission: 0,
            createdBy: { id : mockUser.id},
            updatedBy: null,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        } as Deals, 
        {
          id: 1,
          activeStep: 7,
          status: 'Completed',
          brokerName: 'broker',
          brokerId: 1,
          propertyName: 'broker property',
          dealStartDate: new Date(Date.now()),
          proposalDate: new Date(Date.now()),
          loiExecuteDate: new Date(Date.now()),
          leaseSignedDate: new Date(Date.now()),
          noticeToProceedDate: new Date(Date.now()),
          commercialOperationDate: new Date(Date.now()),
          potentialCommissionDate: new Date(Date.now()),
          potentialCommission: 100000,
          createdBy: { id : mockUser.id},
          updatedBy: null,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
      } as Deals,
      {
        id: 1,
        activeStep: 5,
        status: 'In-Progress',
        brokerName: 'broker',
        brokerId: 1,
        propertyName: 'broker property',
        dealStartDate: new Date(Date.now()),
        proposalDate: new Date(Date.now()),
        loiExecuteDate: new Date(Date.now()),
        leaseSignedDate: new Date(Date.now()),
        noticeToProceedDate: new Date(Date.now()),
        commercialOperationDate: new Date(Date.now()),
        potentialCommissionDate: new Date(Date.now()),
        potentialCommission: 0,
        createdBy: { id : mockUser.id},
        updatedBy: null,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
    } as Deals];

        jest.spyOn(userRoleRepository, 'createQueryBuilder').mockReturnValueOnce(
            {
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValueOnce([mockUserRole]),
            } as any
        );

        jest.spyOn(dealsRepository, 'find').mockResolvedValue(mockDeals);

        const roleId = [1, 2];
        const result = await service.findAllUsers(roleId);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          user: mockUser,
          roleId: mockRole.id,
          totalDeals: 3,
          dealsOpened: 1,
          dealsInProgress: 1,
          dealsClosed: 1,
          totalCommission: 100000,
        });
        expect(userRoleRepository.createQueryBuilder).toHaveBeenCalled();
        expect(dealsRepository.find).toHaveBeenCalledWith({
          where: { createdBy: { id: mockUser.id } },
        });
    });

    it('should return NotFoundException if user with specified role not found', async () => {
      jest.spyOn(userRoleRepository, 'createQueryBuilder').mockReturnValueOnce(
        {
            innerJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValueOnce([]),
        } as any
      );

      await expect(service.findAllUsers()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBroker', () => { 
    it('should update broker details', async () => {
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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(service, 'getBrokerById').mockResolvedValue(mockUser);

      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        ...mockUpdateBrokerDto,
      })

      const result = await service.updateBroker(1, mockUpdateBrokerDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(service.getBrokerById).toHaveBeenCalledWith(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...mockUpdateBrokerDto,
      });
    });

    it('should return NotFoundException if invalid broker id', async () => {
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

      jest.spyOn(service, 'getBrokerById').mockResolvedValue(null);

      await expect(service.updateBroker(1, mockUpdateBrokerDto)).rejects.toThrow(HttpException);
    });
  });

  describe('getBrokerById', () => {
    it('should return the user of respective id', async () => {
      const mockUserId = 1;

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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getBrokerById(mockUserId);

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    
    it('should return NotFoundException if invalid broker id', async () => {
      const mockUserId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getBrokerById(mockUserId)).rejects.toThrow(HttpException);
    });
  });

  describe('setActiveBroker', () => { 
    it('should set broker active', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      }

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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.setActiveBroker(mockUserId, mockSetActiveBrokerDto);

      expect(result).toBeDefined();
      expect(userRepository.update).toHaveBeenCalled();
    });

    it('should return NotFoundException if invalid broker id', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      }

      jest.spyOn(service, 'getBrokerById').mockResolvedValue(null);

      await expect(service.setActiveBroker(mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(NotFoundException);
    });

    it('should return BadRequestException if broker already in active state', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      }

      const mockUser = {
        id: mockUserId,
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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.setActiveBroker(mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(BadRequestException);
    });

    it('should return BadRequestException if broker already in deactive state', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: false,
      }

      const mockUser = {
        id: mockUserId,
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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.setActiveBroker(mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(BadRequestException);
    });

    it('should return NotFoundException if not found updated broker', async () => {
      const mockUserId = 1;

      const mockSetActiveBrokerDto = {
        isActive: true,
      }

      const mockUser = {
        id: mockUserId,
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
        createdSites: null,
        updatedSites: null,
        lastModifiedBy: 1,
        isAdmin: false,
      };

      jest.spyOn(service, 'getBrokerById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.setActiveBroker(mockUserId, mockSetActiveBrokerDto)).rejects.toThrow(new NotFoundException('The account associated with this user was'));
    });
  });
  
  describe('deleteBroker', () => {
    it('should delete a broker', async () => {
      const mockUserId = 1;

      const mockUser = [];

      jest.spyOn(dealsRepository, 'count').mockResolvedValue(mockUser.length);
      jest.spyOn(userRepository, 'delete').mockResolvedValue({
        affected: 1, raw: {}
      });

      const result = await service.deleteBroker(mockUserId);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Broker deleted successfully');
      expect(dealsRepository.count).toHaveBeenCalled();
      expect(userRepository.delete).toHaveBeenCalled();
    });

    it('should return BadRequestException if broker have deals', async () => {
      const mockUserId = 1;

      const mockUser = [new Users(), new Users()];

      jest.spyOn(dealsRepository, 'count').mockResolvedValue(mockUser.length);

      await expect(service.deleteBroker(mockUserId)).rejects.toThrow(BadRequestException);
    });

    it('should return NotFoundException if invalid broker id', async () => {
      const mockUserId = 1;

      const mockUser = [];

      jest.spyOn(dealsRepository, 'count').mockResolvedValue(mockUser.length);
      jest.spyOn(userRepository, 'delete').mockResolvedValue({
        affected: 0, raw: {}
      });

      await expect(service.deleteBroker(mockUserId)).rejects.toThrow(NotFoundException);
    });
  });
  
});