import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';


export class UpdateSiteDto {
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
}
