import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}