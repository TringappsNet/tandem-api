import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';

export class UpdateDealDto {
  @IsNotEmpty()
  activeStep: number;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  brokerName: string;

  @IsNotEmpty()
  propertyName: string;

  dealStartDate: Date;

  proposalDate: Date;

  loiExecuteDate: Date;

  leaseSignedDate: Date;

  noticeToProceedDate: Date;

  commercialOperationDate: Date;

  potentialCommissionDate: Date;

  potentialCommission: number;

  @IsInt()
  updatedBy: Users;
}