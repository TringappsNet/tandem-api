import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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
  ) {}

  async login(loginDTO: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDTO.email },
      });
      if (!user) {
        throw new HttpException(
          'You are not a registered user',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!user.isActive) {
        throw new HttpException(
          'User account is inactive. Please contact support.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        loginDTO.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
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

      const { password, createdAt, updatedAt, isActive,resetToken, resetTokenExpires, ...userObject } = user;

      return {
        message: 'Login successful',
        user: userObject,
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
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const existingInvite = await this.inviteRepository.findOne({
        where: { email: inviteDTO.email },
      });
      if (existingInvite) {
        throw new HttpException(
          'Invite already sent to this email',
          HttpStatus.BAD_REQUEST,
        );
      }

      const role = await this.roleRepository.findOne({
        where: { id: inviteDTO.roleId },
      });

      if (!role) {
        throw new HttpException('Invalid role ID', HttpStatus.BAD_REQUEST);
      }

      const inviteUser = new InviteUser();
      inviteUser.email = inviteDTO.email;
      inviteUser.roleId = inviteDTO.roleId;
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
      const text = `Hello! You have been invited to join our platform. Please click on the following link to complete your registration: ${authConstants.hostname}:${authConstants.port}/${authConstants.endpoints.register}?inviteToken=${inviteUser.inviteToken}
                    NOTE: this token is valid for only 24 hours`;

      await this.mailService.sendMail(inviteDTO.email, subject, text);
    } catch (error) {
      throw error;
    }
  }

  async register(registerDTO: RegisterDto) {
    const inviteUser = await this.inviteRepository.findOne({
      where: { inviteToken: registerDTO.inviteToken },
    });

    if (!inviteUser) {
      throw new BadRequestException('Invalid Invite Token');
    }

    if (inviteUser.inviteTokenExpires < new Date()) {
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
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordDTO.email },
      });
      if (!user) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }

      user.resetToken = crypto.randomBytes(50).toString('hex').slice(0, 100);
      user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

      await this.userRepository.save(user);

      const resetUrl = `${authConstants.hostname}:${authConstants.port}/${authConstants.endpoints.forgotPassword}?resetToken=${user.resetToken}`;

      const subject = 'Password Reset Request';
      const text = `Hello! To reset your password, please click the following link: ${resetUrl}
                    This link is valid for 1 hour.`;

      await this.mailService.sendMail(user.email, subject, text);
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
    const user = await this.userRepository.findOne({
      where: { id: resetPasswordDTO.userId },
    });
    if (!user) {
      throw new HttpException(
        'Invalid UserID Received',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.isActive) {
      throw new HttpException(
        'User account is inactive. Please contact support.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedPassword = await bcrypt.hash(resetPasswordDTO.newPassword, 10);
    await this.userRepository.update(user.id, { password: updatedPassword });
  }

  async logout(token: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { token },
      });

      if (!session) {
        throw new HttpException(
          'Invalid session token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.sessionRepository.delete({ token: session.token });

      return { message: 'Logout successful' };
    } catch (error) {
      throw error;
    }
  }
}