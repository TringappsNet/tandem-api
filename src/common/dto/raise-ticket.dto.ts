import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';

export class RaiseTicketDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  ticketSubject: string;

  @IsNotEmpty()
  ticketDescription: string;

  @IsInt()
  createdBy: Users;
}
