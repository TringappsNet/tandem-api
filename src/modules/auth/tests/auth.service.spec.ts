import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { Users } from '../../../common/entities/user.entity';
import { Session } from '../../../common/entities/session.entity';
import { InviteUser } from '../../../common/entities/invite.entity';
import { Role } from '../../../common/entities/role.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { MailService } from '../../../common/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RoleService } from '../../user-role/role/role.service';
import { RoleModule } from 'src/modules/user-role/role/role.module';
import { UserRoleModule } from 'src/modules/user-role/user-role.module';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<Users>;
  let sessionRepository: Repository<Session>;
  let inviteRepository: Repository<InviteUser>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
  let mailService: MailService;
  let jwtService: JwtService;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        MailService,
        RoleService,
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
    roleService = module.get<RoleService>(RoleService);
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

      const mockSession = {
        userId: 1,
        token:
          '2304c37032a7d6ef516cc25d4880f40d255fd4cd21cc311da2ff1087460d2b7e82968c9b56057104fbeafb23394a70eca22e',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        id: 1,
        createdAt: new Date(Date.now()),
      };

      const mockRole = {
        id: 1,
        roleName: 'Admin',
        description: 'Admin-Role',
        createdBy: 1,
        createdAt: new Date(Date.now()),
        updatedBy: 1,
        updatedAt: new Date(Date.now()),
      };

      const mockUserRole = {
        id: 1,
        userId: 1,
        roleId: 1,
        user: mockUser,
        role: mockRole,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(sessionRepository, 'save').mockResolvedValue(mockSession);
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(mockUserRole);
      jest.spyOn(roleService, 'getRoleById').mockResolvedValue(mockRole);

      const result = await service.login(mockLoginDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Login successful');
      expect(result.user.id).toEqual(mockUser.id);
      expect(result.session.token).toEqual(expect.any(String));
      expect(sessionRepository.save).toHaveBeenCalledTimes(1);
      expect(roleService.getRoleById).toHaveBeenCalled();
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
        firstName: 'test',
        lastName: 'test',
        mobile: null,
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
        firstName: 'test',
        lastName: 'test',
        mobile: null,
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: null,
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

      const mockLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

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

      expect(result).toBeDefined();
      expect(result.message).toEqual('Invite sent successfully');
      expect(spySendMail).toHaveBeenCalled();
      expect(inviteRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if email already exist', async () => {
      const mockUser = {
        id: 1,
        email: 'invite@gmail.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'test',
        lastName: 'test',
        mobile: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: null,
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

  describe('register', () => {
    it('should register user successfully with valid invite token', async () => {
      const mockInviteUser = {
        id: 1,
        email: 'invite@gmail.com',
        roleId: 2,
        inviteToken: 'qwertyuiop',
        inviteTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        invitedBy: 1,
        createdAt: new Date(Date.now()),
      };

      const mockRegisterDto = {
        firstName: 'test',
        lastName: 'test',
        mobileNo: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        inviteToken: 'qwertyuiop',
        password: await bcrypt.hash('password123', 10),
      };

      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(mockInviteUser);
      jest
        .spyOn(userRepository, 'save')
        .mockImplementation((user) =>
          Promise.resolve({ id: 1, ...user } as Users),
        );
      jest.spyOn(userRoleRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(inviteRepository, 'remove').mockResolvedValue(undefined);

      const spySendMail = jest
        .spyOn(mailService, 'sendMail')
        .mockResolvedValue(undefined);

      const result = await service.register(mockRegisterDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Registered Successfully!');
      expect(spySendMail).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if invalid invite token', async () => {
      const mockRegisterDto = {
        firstName: 'test',
        lastName: 'test',
        mobileNo: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        inviteToken: 'qwertyuiop',
        password: await bcrypt.hash('password123', 10),
      };

      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if invite token has expired', async () => {
      const mockRegisterDto = {
        firstName: 'test',
        lastName: 'test',
        mobileNo: '1234567890',
        address: 'test address',
        city: 'test city',
        state: 'test state',
        country: 'test country',
        zipcode: '456789',
        inviteToken: 'qwertyuiop',
        password: await bcrypt.hash('password123', 10),
      };

      const mockInviteUser = {
        id: 1,
        email: 'invite@gmail.com',
        roleId: 2,
        inviteToken: 'qwertyuiop',
        inviteTokenExpires: new Date(Date.now() - 1000),
        invitedBy: 1,
        createdAt: new Date(Date.now()),
      };

      jest.spyOn(inviteRepository, 'findOne').mockResolvedValue(mockInviteUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should sent the password reset link if valid user found', async () => {
      const mockForgotPasswordDto = {
        email: 'test@gmail.com',
      };

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
      jest.spyOn(userRepository, 'save').mockResolvedValue(null);

      const spySendMail = jest
        .spyOn(mailService, 'sendMail')
        .mockResolvedValue(undefined);

      const result = await service.forgotPassword(mockForgotPasswordDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Password reset email sent successfully');
      expect(userRepository.save).toHaveBeenCalled();
      expect(spySendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if valid user not found', async () => {
      const mockForgotPasswordDto = {
        email: 'test@gmail.com',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.forgotPassword(mockForgotPasswordDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('changePassword', () => {
    it('should reset password successfully with valid reset token', async () => {
      const mockChangePasswordDto = {
        newPassword: await bcrypt.hash('newpassword123', 10),
      };

      const resetToken = 'qwertyuiop';

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
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(null);

      const result = await service.changePassword(
        resetToken,
        mockChangePasswordDto,
      );

      expect(result).toBeDefined();
      expect(result.message).toEqual('Password has been reset successfully');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw HttpException if invalid or expired reset token', async () => {
      const mockChangePasswordDto = {
        newPassword: await bcrypt.hash('newpassword123', 10),
      };

      const resetToken = 'qwertyuiop';

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
        resetToken: 'asdfghjkl',
        resetTokenExpires: new Date(Date.now() - 1000),
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

      await expect(
        service.changePassword(resetToken, mockChangePasswordDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('resetPassword', () => {
    it('should change password successfully with valid user and active record', async () => {
      const mockResetPasswordDto = {
        userId: 1,
        oldPassword: 'password123',
        newPassword: 'newpassword123',
      };

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
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

      const result = await service.resetPassword(mockResetPasswordDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Password reset successfully'); // Updated expected message
      expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
        password: expect.any(String),
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully with valid session token', async () => {
      const mockSessionToken = 'qwertyuiop';

      const mockSession = {
        id: 1,
        userId: 1,
        token: 'qwertyuiop',
        expiresAt: new Date(Date.now() + 1000),
        createdAt: new Date(Date.now()),
      };

      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue(mockSession);
      jest.spyOn(sessionRepository, 'delete').mockResolvedValue(null);

      const result = await service.logout(mockSessionToken);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Logout successful');
      expect(sessionRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if invalid session token', async () => {
      const mockSessionToken = 'qwertyuiop';

      jest.spyOn(sessionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.logout(mockSessionToken)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
