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
import { Sites } from './sites.entity';

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
    nullable: true,
  })
  brokerName: string;

  @Column({
    name: 'assigned_to',
    type: 'integer',
    nullable: false,
    default: 1,
  })
  brokerId: number;

  @Column({
    name: 'property_name',
    type: 'varchar',
  })
  propertyName: string;

  @ManyToOne(() => Sites, (site) => site.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'property_id',
  })
  propertyId: Sites;

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
  finalCommissionDate: Date;

  @Column({
    name: 'potential_commission',
    type: 'int',
    default: 0,
  })
  finalCommission: number;

  @ManyToOne(() => Users, (user) => user.createdDeals, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'created_by',
  })
  createdBy: Users;

  @ManyToOne(() => Users, (user) => user.updatedDeals, {
    onDelete: 'SET NULL',
  })
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
