import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
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
  state: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  pincode: number;

  @IsNotEmpty()
  referenceBrokerId: number;

  @IsNotEmpty()
  ssn: number;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  role: number;
}
