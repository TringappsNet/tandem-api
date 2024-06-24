import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity('deals')
export class Deals {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'This is a unique identifier',
  })
  id: number;

  @Column({ 
    name: 'active_step', 
    type: 'int', 
    default: 1,
  })
  activeStep: number;

  @Column({
    name: 'status',
    type: 'varchar',
  })
  status: string;

  @Column({
    name: 'broker_name', 
    type: 'varchar',
  })
  brokerName: string;

  @Column({
    name: 'property_id', 
    type: 'int',
  })
  propertyId: number;

  @Column({
    name: 'deal_start_date', 
    type: 'timestamp', 
    default: null,
  })
  dealStartDate: Date;

  @Column({ 
    name: 'proposal_date', 
    type: 'timestamp', 
    default: null,
  })
  proposalDate: Date;

  @Column({ 
    name: 'loi_execute_date', 
    type: 'timestamp', 
    default: null,
  })
  loiExecuteDate: Date;

  @Column({ 
    name: 'lease_signed_date', 
    type: 'timestamp', 
    default: null,
  })
  leaseSignedDate: Date;

  @Column({ 
    name: 'notice_to_proceed_date', 
    type: 'timestamp', 
    default: null,
  })
  noticeToProceedDate: Date;

  @Column({
    name: 'commercial_operation_date',
    type: 'timestamp',
    default: null,
  })
  commercialOperationDate: Date;

  @Column({
    name: 'potential_commission_date',
    type: 'timestamp',
    default: null,
  })
  potentialCommissionDate: Date;

  @Column({ 
    name: 'potential_commission', 
    type: 'int', 
    default: 0 
  })
  potentialCommission: number;


  @ManyToOne(() => Users, (user) => user.createdDeals)
  @JoinColumn({
    name: 'created_by',
  })
  createdBy: Users;

  @ManyToOne(() => Users, (user) => user.updatedDeals)
  @JoinColumn({
    name: 'updated_by',
  })
  updatedBy: Users;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date = undefined;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date = undefined;
}
