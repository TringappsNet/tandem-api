import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  roleName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  updatedBy: number;
}
