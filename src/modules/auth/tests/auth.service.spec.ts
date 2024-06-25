import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { Repository } from 'typeorm';
import { Users } from '../../../common/entities/user.entity';
import { Session } from '../../../common/entities/session.entity';
import { InviteUser } from '../../../common/entities/invite.entity';
import { Role } from '../../../common/entities/role.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { MailService } from '../../../common/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<Users>;
  let sessionRepository: Repository<Session>;
  let inviteRepository: Repository<InviteUser>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        MailService,
        JwtService,
        {
          provide: MailerService,
          useValue: { send: jest.fn() },
        },
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Session),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(InviteUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserRole),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    sessionRepository = module.get<Repository<Session>>(
      getRepositoryToken(Session),
    );
    inviteRepository = module.get<Repository<InviteUser>>(
      getRepositoryToken(InviteUser),
    );
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    userRoleRepository = module.get<Repository<UserRole>>(
      getRepositoryToken(UserRole),
    );
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return user details and session on successful login', async () => {
      const mockLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstname: 'test',
        lastname: 'test',
        mobile: 1234567890,
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        pincode: null,
        ssn: null,
        age: null,
        referenceBrokerId: null,
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

      const mockSession = {
        userId: 1,
        token:
          '2304c37032a7d6ef516cc25d4880f40d255fd4cd21cc311da2ff1087460d2b7e82968c9b56057104fbeafb23394a70eca22e',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        id: 1,
        createdAt: new Date(Date.now()),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue(mockSession);
      jest.spyOn(sessionRepository, 'save').mockResolvedValue(mockSession);

      const result = await service.login(mockLoginDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Login successful');
      expect(result.user.id).toEqual(mockUser.id);
      expect(result.session.token).toEqual(mockSession.token);
      expect(sessionRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if user does not exist', async () => {
      const mockLoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if user account is inactive', async () => {
      const mockInactiveUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstname: 'test',
        lastname: 'test',
        mobile: null,
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        pincode: null,
        ssn: null,
        age: null,
        referenceBrokerId: null,
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
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockInactiveUser);

      const mockLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(service.login(mockLoginDto)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstname: 'test',
        lastname: 'test',
        mobile: null,
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        pincode: null,
        ssn: null,
        age: null,
        referenceBrokerId: null,
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

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const mockLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(service.login(mockLoginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('sendInvite', () => {
    it('should send invite email successfully', async () => {
      const mockInviteDto = { email: 'invite@gmail.com', roleId: 2 };

      const mockRole = {
        id: 2,
        roleName: 'broker',
        description: 'broker-role',
        createdBy: 1,
        createdAt: new Date(Date.now()),
        updatedBy: 1,
        updatedAt: new Date(Date.now()),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(inviteRepository, 'save').mockResolvedValue(null);

      const spySendMail = jest
        .spyOn(mailService, 'sendMail')
        .mockResolvedValue(undefined);

      const result = await service.sendInvite(mockInviteDto);

      expect(result).toBeUndefined();
      expect(spySendMail).toHaveBeenCalled();
      expect(inviteRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if email already exist', async () => {
      const mockUser = {
        id: 1,
        email: 'invite@gmail.com',
        password: await bcrypt.hash('password123', 10),
        firstname: 'test',
        lastname: 'test',
        mobile: 1234567890,
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        pincode: null,
        ssn: null,
        age: null,
        referenceBrokerId: null,
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

      const mockInviteDto = { email: 'invite@gmail.com', roleId: 2 };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.sendInvite(mockInviteDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if invite already sent to the email', async () => {
      const mockInviteUser = {
        id: 1,
        email: 'test@gmail.com',
        roleId: 2,
        inviteToken: null,
        inviteTokenExpires: null,
        invitedBy: 1,
        createdAt: null,
      };

      const mockInviteDto = { email: 'test@gmail.com', roleId: 2 };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(mockInviteUser);

      await expect(service.sendInvite(mockInviteDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if invalid role id', async () => {
      const mockInviteDto = { email: 'test@gmail.com', roleId: 21 };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.sendInvite(mockInviteDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
