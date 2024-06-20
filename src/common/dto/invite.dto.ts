import { IsNotEmpty } from 'class-validator';

export class InviteDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty()
  roleId: number;

  @IsNotEmpty()
  invitedBy: number;
}
