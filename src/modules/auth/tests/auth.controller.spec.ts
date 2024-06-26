import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Users } from '../../../common/entities/user.entity';
import { InviteUser } from '../../../common/entities/invite.entity';
import { Role } from '../../../common/entities/role.entity';
import { UserRole } from '../../../common/entities/user-role.entity';
import { MailService } from '../../../common/mail/mail.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'inspector';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from '../../../common/dto/login.dto';
import { InviteDto } from '../../../common/dto/invite.dto';

describe('AuthController', () => {
  let controller: AuthController;
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
      controllers: [AuthController],
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
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
    it('should return a login object with properties', async () => {
      const mockLoginDto: LoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      const mockLogin = {
        message: 'Login successful',
        user: { id: 1, email: 'test@gmail.com' },
        session: { token: 'qwertyuiop', expiresAt: new Date(Date.now() + 1000)},
      }

      jest.spyOn(service, 'login').mockResolvedValue(mockLogin); 

      const result = await controller.login(mockLoginDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockLogin);
      expect(service.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('sendInvite', () => {
    it('should return the mail successfully sent message', async () => {
      const mockInviteDto: InviteDto = {
        email: 'test@gmail.com',
        roleId: 2,
      };

      jest.spyOn(service, 'sendInvite').mockResolvedValue(undefined);

      const result = controller.sendInvite(mockInviteDto);

      expect(result).toBeDefined();
      expect(result.message).toEqual('Invitation sent successfully');
      expect(service.sendInvite).toHaveBeenCalledWith(mockInviteDto);
    });
  });
  


});
