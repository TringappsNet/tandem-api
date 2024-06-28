import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  lastName: string;

  mobileNo: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  address: string;

  city: string;

  state: string;

  country: string;

  zipcode: string;
  
  @IsNotEmpty()
  inviteToken: string;
}
