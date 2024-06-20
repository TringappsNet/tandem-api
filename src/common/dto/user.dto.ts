import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  pincode: number;

  @IsNotEmpty()
  role: number;
}
