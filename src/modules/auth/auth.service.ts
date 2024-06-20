import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from '../login/login.service';
import * as bcrypt from 'bcrypt';
import { InviteDto } from 'src/common/dto/invite.dto';
import { InviteUser } from 'src/common/entities/invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { MailService } from 'src/common/mail/mail.service';
import { TokenDto } from 'src/common/dto/token.dto';
import Session from 'src/common/entities/session.entity';
import { LoginDto } from 'src/common/dto/login.dto';
import { Users } from 'src/common/entities/user.entity';
import { Role } from 'src/common/entities/role.entity';

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
          'Invalid email or password',
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
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      let session = await this.sessionRepository.findOne({
        where: { userId: user.id },
      });

      if (!session) {
        session = new Session();
        session.userId = user.id;
      }

      session.token = crypto.randomBytes(50).toString('hex'),
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.sessionRepository.save(session);

      return {
        message: 'Login successful',
        user: { id: user.id, email: user.email },
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
      inviteUser.invitedBy = inviteDTO.invitedBy;

      await this.inviteRepository.save(inviteUser);

      const subject = 'Invitation to join our platform';
      const text = `Hello! You have been invited to join our platform. Please click on the following link to complete your registration: http://192.168.1.69:3001/registerform?inviteToken=${inviteUser.inviteToken}
                    NOTE: this token is valid for only 24 hours`;

      await this.mailService.sendMail(inviteDTO.email, subject, text);
    } catch (error) {
      throw error;
    }
  }

  async tokenValidate(tokenDTO: TokenDto) {
    const inviteUser = await this.inviteRepository.findOne({
      where: { inviteToken: tokenDTO.token },
    });

    if(!inviteUser) {
      throw new BadRequestException(
        'Invalid Invite Token',
      )
    }

    if(inviteUser.inviteTokenExpires < new Date()){
      await this.inviteRepository.remove(inviteUser);
      throw new BadRequestException(
        'Invite Token has expired',
      )
    }

  }
}
