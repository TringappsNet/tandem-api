import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Deals } from './deals.entity';
import { Sites } from './sites.entity';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'This is a unique identifier',
  })
  id: number;

  @Column({
    name: 'email_id',
    type: 'varchar',
    default: '',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
  })
  lastName: string;

  @Column({
    name: 'mobile',
    type: 'varchar',
  })
  mobile: string;

  @Column({
    name: 'address',
    type: 'varchar',
    default: '',
  })
  address: string;

  @Column({
    name: 'city',
    type: 'varchar',
    default: '',
  })
  city: string;

  @Column({
    name: 'state',
    type: 'varchar',
    default: '',
  })
  state: string;

  @Column({
    name: 'country',
    type: 'varchar',
    default: '',
  })
  country: string;

  @Column({
    name: 'zipcode',
    type: 'varchar',
    default: '',
  })
  zipcode: string;

  @Column({
    name: 'is_active',
    default: false,
    type: 'boolean',
  })
  isActive: boolean;

  @Column({
    name: 'is_admin',
    default: false,
    type: 'boolean',
  })
  isAdmin: boolean;

  @Column({
    name: 'last_modified_by',
    type: 'integer',
    nullable: false,
    default: 1,
  })
  lastModifiedBy: number;

  @Column({
    name: 'reset_token',
    type: 'varchar',
    default: '',
  })
  resetToken: string;

  @Column({
    name: 'reset_token_expires',
    type: 'timestamp',
    default: null,
  })
  resetTokenExpires: Date;

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

  @OneToMany(() => Deals, (deal) => deal.createdBy, {
    cascade: true,
  })
  createdDeals: Deals[];

  @OneToMany(() => Deals, (deal) => deal.updatedBy, {
    cascade: true,
  })
  updatedDeals: Deals[];

  // @OneToMany(() => Sites, (site) => site.createdBy)
  // createdSites: Sites[];

  // @OneToMany(() => Sites, (site) => site.updatedBy)
  // updatedSites: Sites[];
}
