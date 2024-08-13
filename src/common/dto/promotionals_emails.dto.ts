import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsBoolean()
  isDefault: boolean = true;
}
