import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InviteDto } from 'src/common/dto/invite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { LoginDto } from 'src/common/dto/login.dto';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';
import { RegisterDto } from 'src/common/dto/register.dto';
import { ForgotPasswordDto } from 'src/common/dto/forgot-password.dto';
import { ChangePasswordDto } from 'src/common/dto/change-password.dto';
import { Session } from './../../common/entities/session.entity';
import { Users } from './../../common/entities/user.entity';
import { Role } from './../../common/entities/role.entity';
import { UserRole } from './../../common/entities/user-role.entity';
import { InviteUser } from './../../common/entities/invite.entity';
import { MailService } from './../../common/mail/mail.service';
import { authConstants } from './../../common/constants/auth.constants';
import { RoleService } from '../user-role/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(InviteUser)
    private inviteRepository: Repository<InviteUser>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private mailService: MailService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}

  async login(loginDTO: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDTO.email },
      });

      if (!user) {
        throw new UnauthorizedException('You are not a registered user');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive. Please contact support.');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDTO.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect Password');
      }

      let session = await this.sessionRepository.findOne({
        where: { userId: user.id },
      });

      if (!session) {
        session = new Session();
        session.userId = user.id;
      }

      (session.token = crypto.randomBytes(50).toString('hex')),
        (session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000));

      await this.sessionRepository.save(session);

      const {
        password,
        createdAt,
        updatedAt,
        isActive,
        resetToken,
        resetTokenExpires,
        ...userObject
      } = user;

      const roleObject = await this.roleService.getRoleById(user.id);

      return {
        message: 'Login successful',
        user: userObject,
        role: roleObject,
        session: { token: session.token, expiresAt: session.expiresAt },
      };
    } catch (error) {
      throw error;
    }
  }

  async sendInvite(inviteDTO: InviteDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: inviteDTO.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const existingInvite = await this.inviteRepository.findOne({
        where: { email: inviteDTO.email },
      });
      if (existingInvite) {
        throw new BadRequestException('Invite already sent to this email');
      }

      const role = await this.roleRepository.findOne({
        where: { id: inviteDTO.roleId },
      });

      if (!role) {
        throw new BadRequestException('Invalid role ID');
      }

      const inviteUser = new InviteUser();
      inviteUser.email = inviteDTO.email;
      inviteUser.roleId = Number(inviteDTO.roleId);
      inviteUser.inviteToken = crypto
        .randomBytes(50)
        .toString('hex')
        .slice(0, 100);
      inviteUser.inviteTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );
      // inviteUser.invitedBy = inviteDTO.invitedBy;

      await this.inviteRepository.save(inviteUser);

      const subject = 'Invitation to join our platform';
      const link =  `${authConstants.hostname}:${authConstants.port}/${authConstants.endpoints.register}?inviteToken=${inviteUser.inviteToken}`;
      const option = 'View Invitation';
      const text = 'You have been invited to join our platform. Please click on the invitation to complete your registration: ';

      await this.mailService.sendMail(inviteDTO.email, subject, link, text, option);

      return { message: 'Invite sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async register(registerDTO: RegisterDto) {
    try {
      const inviteUser = await this.inviteRepository.findOne({
        where: { inviteToken: registerDTO.inviteToken },
      });
  
      if (!inviteUser) {
        throw new BadRequestException('Invalid Invite Token');
      }
  
      if (inviteUser.inviteTokenExpires < new Date()) {
        await this.inviteRepository.remove(inviteUser);
        throw new BadRequestException('Invite Token has expired');
      }
  
      const user = new Users();
  
      user.email = inviteUser.email;
      user.password = await bcrypt.hash(registerDTO.password, 10);
      user.firstName = registerDTO.firstName;
      user.lastName = registerDTO.lastName;
      user.mobile = registerDTO.mobileNo;
      user.address = registerDTO.address;
      user.city = registerDTO.city;
      user.state = registerDTO.state;
      user.country = registerDTO.country;
      user.zipcode = registerDTO.zipcode;
      user.isActive = true;
  
      const savedUser = await this.userRepository.save(user);
  
      const userRole = new UserRole();
      userRole.userId = savedUser.id;
      userRole.roleId = inviteUser.roleId;
      await this.userRoleRepository.save(userRole);
  
      await this.inviteRepository.remove(inviteUser);
  
      return { message: 'Registered Successfully!' };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordDTO.email },
      });

      if (!user) {
        throw new NotFoundException('Email not found');
      }

      user.resetToken = crypto.randomBytes(50).toString('hex').slice(0, 100);
      user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

      await this.userRepository.save(user);

      const link = `${authConstants.hostname}:${authConstants.port}/${authConstants.endpoints.forgotPassword}?resetToken=${user.resetToken}`;

      const subject = 'Password Reset Request';
      const text = 'To reset your password, please click the following link:';
      const option = 'Reset password';

      await this.mailService.sendMail(user.email, subject, link, text, option);

      return { message: 'Password reset email sent successfully'};
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    resetToken: string,
    changePasswordDTO: ChangePasswordDto,
  ) {
    try {
      const user = await this.userRepository.findOne({ where: { resetToken } });
      if (!user || user.resetTokenExpires < new Date()) {
        throw new HttpException(
          'Invalid or expired reset token',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = await bcrypt.hash(changePasswordDTO.newPassword, 10);
      user.resetToken = '';
      user.resetTokenExpires = null;

      await this.userRepository.save(user);

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: resetPasswordDTO.userId },
      });
  
      if (!user) {
        throw new BadRequestException('Invalid UserID Received');
      }
  
      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive. Please contact support.');
      }
  
      const updatedPassword = await bcrypt.hash(resetPasswordDTO.newPassword, 10);
      await this.userRepository.update(user.id, { password: updatedPassword });
  
      return { message: 'Reset Password successfully' };
    } catch (error) {
      throw error;
    }
  }

  async logout(token: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { token },
      });

      if (!session) {
        throw new BadRequestException('Invalid session token');
      }

      await this.sessionRepository.delete({ token: session.token });

      return { message: 'Logout successful' };
    } catch (error) {
      throw error;
    }
  }
}
