import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';
import { Sites } from '../entities/sites.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDealDto {
  @IsNotEmpty()
  activeStep: number;

  @IsNotEmpty()
  status: string;

  brokerName: string;

  brokerId: number;

  @IsNotEmpty()
  propertyName: string;

  @IsNotEmpty()
  propertyId: Sites;

  propertyAddress: string;

  dealStartDate: Date;

  proposalDate: Date;

  loiExecuteDate: Date;

  leaseSignedDate: Date;

  noticeToProceedDate: Date;

  commercialOperationDate: Date;

  finalCommissionDate: Date;
  finalCommission: number;

  @IsNotEmpty()
  @ApiProperty({ example: { id: 1 } })
  createdBy: Users;

  @IsNotEmpty()
  isNew: boolean;
}
