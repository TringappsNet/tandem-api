import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Users } from '../entities/user.entity';

export class CreateSiteDto {
  @IsNotEmpty()
  landlordId: number;
  
  @IsNotEmpty()
  @IsString()
  addressline1: string;

  @IsOptional()
  @IsString()
  addressline2: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsInt()
  createdBy: number;

  @IsNotEmpty()
  isNew: boolean;
}
