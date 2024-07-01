import { Test, TestingModule } from '@nestjs/testing';
import { BrokerService } from '../broker.service';
import { Repository } from 'typeorm';
import { Users } from '../../../common/entities/user.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { Deals } from '../../../common/entities/deals.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../common/entities/role.entity';

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

  describe('findByRoleId', () => {
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

        const mockDeals = {
            id: 1,
            activeStep: 1,
            status: 'Started',
            brokerName: 'broker',
            propertyName: 'broker property',
            dealStartDate: new Date(Date.now()),
            proposalDate: new Date(Date.now()),
            loiExecuteDate: new Date(Date.now()),
            leaseSignedDate: new Date(Date.now()),
            noticeToProceedDate: new Date(Date.now()),
            commercialOperationDate: new Date(Date.now()),
            potentialCommissionDate: new Date(Date.now()),
            potentialCommission: 0,
            createdBy: { id : mockUserRole.id},
            updatedBy: null,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        } as Deals

        jest.spyOn(userRoleRepository, 'createQueryBuilder').mockReturnValueOnce(
            {
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValueOnce([mockUserRole]),
            } as any
        );

        jest.spyOn(dealsRepository, 'find').mockResolvedValue([mockDeals]);

        const roleId = 2;
        const result = await service.findByRoleId(roleId);

        expect(result).toBeUndefined();
        expect(result).toEqual(mockUserRole);
        expect(userRoleRepository.createQueryBuilder).toHaveBeenCalled();
        expect(dealsRepository.find).toHaveBeenCalledWith({
          where: { createdBy: { id: mockUserRole.id } },
        });
    });
  });
});