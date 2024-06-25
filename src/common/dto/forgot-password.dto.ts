import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Password should not be empty' })
  newPassword: string;
}
