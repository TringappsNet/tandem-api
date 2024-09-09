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

  loiExecuteDate: Date;

  leaseSignedDate: Date;

  noticeToProceedDate: Date;

  commercialOperationDate: Date;

  potentialCommissionDate: Date;

  potentialCommission: number;

  @IsInt()
  updatedBy: Users;
}
