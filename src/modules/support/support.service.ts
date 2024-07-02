import { Support } from '../../common/entities/support.entity';
import { Repository } from 'typeorm';
import { RaiseTicketDto } from 'src/common/dto/raise-ticket.dto';
import { MailService } from '../../common/mail/mail.service';
import { Injectable } from '@nestjs/common';
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
      support.createdBy = raiseTicketDto.createdBy;

      await this.supportRepository.save(support);

      const userId: number = raiseTicketDto.createdBy as unknown as number;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      const name = user.firstName + ' ' + user.lastName;

      await this.mailService.supportMail(
        name,
        raiseTicketDto.email,
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
