import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
  
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  mobileno: number

  @IsNotEmpty()
  inviteToken: string

}
