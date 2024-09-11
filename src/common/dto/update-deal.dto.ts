import { IsInt, IsNotEmpty } from 'class-validator';
import { Users } from '../entities/user.entity';
import { Sites } from '../entities/sites.entity';

export class UpdateDealDto {
  @IsNotEmpty()
  activeStep: number;

  @IsNotEmpty()
  status: string;

  brokerName: string;

  @IsNotEmpty()
  brokerId: number;

  @IsNotEmpty()
  propertyName: string;

  @IsNotEmpty()
  propertyId: Sites;

  dealStartDate: Date;

  proposalDate: Date;
  proposalCommission: number;

  loiExecuteDate: Date;
  loiExecuteCommission: number;

  leaseSignedDate: Date;
  leaseSignedCommission: number;

  noticeToProceedDate: Date;
  noticeToProceedCommission: number;

  commercialOperationDate: Date;
  commercialOperationCommission: number;

  potentialCommissionDate: Date;

  potentialCommission: number;

  @IsInt()
  updatedBy: Users;
}
