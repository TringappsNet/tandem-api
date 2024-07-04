import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class UpdateBrokerDto {
  firstName: string;

  lastName: string;

  mobile: string;

  address: string;

  city: string;

  state: string;

  country: string;

  zipcode: string;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  lastModifiedBy: number = 1;
}