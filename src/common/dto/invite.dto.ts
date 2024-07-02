import { IsInt, IsNotEmpty } from 'class-validator';

export class InviteDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty()
  @IsInt({ message: 'RoleId should be an number'})
  roleId: number;
}