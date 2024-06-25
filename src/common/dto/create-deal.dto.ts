import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';

export class CreateDealDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  activeStep: number;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  brokerName: string;

  @IsNotEmpty()
  propertyId: number;

  @IsNotEmpty()
  dealStartDate: Date;

  @IsNotEmpty()
  proposalDate: Date;

  @IsNotEmpty()
  loiExecuteDate: Date;

  @IsNotEmpty()
  leaseSignedDate: Date;

  @IsNotEmpty()
  noticeToProceedDate: Date;

  @IsNotEmpty()
  commercialOperationDate: Date;

  @IsNotEmpty()
  potentialCommissionDate: Date;

  @IsNotEmpty()
  potentialCommission: number;

  @IsInt()
  createdBy: Users;
}