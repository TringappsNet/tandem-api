import { Support } from '../../common/entities/support.entity';
import { Repository } from 'typeorm';
import { RaiseTicketDto } from 'src/common/dto/raise-ticket.dto';
import { MailService } from '../../common/mail/mail.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private mailService: MailService,
  ) {}

  async raiseTicket(raiseTicketDto: RaiseTicketDto) {
    try {
      const support = new Support();
      support.ticketSubject = raiseTicketDto.ticketSubject;
      support.ticketDescription = raiseTicketDto.ticketDescription;
      support.createdBy = raiseTicketDto.senderId;

      await this.supportRepository.save(support);

      const userId: number = raiseTicketDto.senderId as unknown as number;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('You are not a registered user');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive. Please contact support.');
      }

      if (!user.email) {
        throw new UnauthorizedException('User email is not verified.');
      }

      const name = user.firstName + ' ' + user.lastName;
      const email = user.email;

      await this.mailService.supportMail(
        name,
        email,
        raiseTicketDto.ticketSubject,
        raiseTicketDto.ticketDescription,
      );

      return {
        message: 'Ticket raised successfully',
      };
    } catch (error) {
      throw new Error('Error while raising ticket ' + error);
    }
  }
}