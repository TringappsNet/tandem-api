import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PromotionalEmailsDto {
  @IsNotEmpty()
  ticketSubject: string;

  @IsNotEmpty()
  ticketDescription: string;

  @IsNotEmpty()
  emails: string[];

  @IsOptional()
  @IsString()
  template: string;
}
