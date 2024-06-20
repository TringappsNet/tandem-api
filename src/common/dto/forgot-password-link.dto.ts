import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordLinkDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;
}
