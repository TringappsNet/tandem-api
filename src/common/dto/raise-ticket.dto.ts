import { IsInt, IsNotEmpty } from 'class-validator';

export class RaiseTicketDto {
  @IsNotEmpty()
  ticketSubject: string;

  @IsNotEmpty()
  ticketDescription: string;

  @IsInt()
  senderId: number;
}
