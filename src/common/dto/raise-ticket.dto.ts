import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';

export class RaiseTicketDto {
  @IsNotEmpty()
  ticketSubject: string;

  @IsNotEmpty()
  ticketDescription: string;

  @IsInt()
  senderId: number;
}