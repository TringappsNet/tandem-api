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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(InviteUser) private inviteRepository: Repository<InviteUser>,
    private mailService: MailService,
    private loginService: LoginService,
    private jwtService: JwtService,
  ) {}

  async loginDetails(email: string, password: string) {
    const user = await this.loginService.findOne(email);
    if (!user) {
      throw new UnauthorizedException(
        'You are not a registered user',
        // HttpStatus.UNAUTHORIZED,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    console.log(user.email, user.password);
    if (!match) {
      throw new UnauthorizedException(
        'Incorrect Password',
      );
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Login Successfully',
    };
  }

  async sendInvite(inviteDTO: InviteDto) {

    const inviteUser = new InviteUser();
    inviteUser.email = inviteDTO.email;
    inviteUser.roleId = inviteDTO.roleId;
    inviteUser.inviteToken = crypto
      .randomBytes(50)
      .toString('hex')
      .slice(0, 100);
    inviteUser.inviteTokenExpires = new Date(Date.now() + 2 * 60 * 1000) // new Date(Date.now() + 24 * 60 * 60 * 1000);
    inviteUser.invitedBy = inviteDTO.invitedBy;

    await this.inviteRepository.save(inviteUser);

    const subject = 'Invitation to join our platform';
    const text = `Hello! You have been invited to join our platform. Please click on the following link to complete your registration: http://192.168.1.69:3001/registerform?inviteToken=${inviteUser.inviteToken}
                  NOTE: this token is valid for only 24 hours`;

    await this.mailService.sendMail(inviteDTO.email, subject, text);

    return {message: 'Invite the User Successfully'}
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
      throw new BadRequestException(
        'Invite Token has expired',
      )
    }

  }
}
