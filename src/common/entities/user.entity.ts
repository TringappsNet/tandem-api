import { MaxLength, MinLength } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  firstname: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
  })
  lastname: string;

  @Column({
    name: 'mobile',
    type: 'int',
  })
  mobile: number;

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
    name: 'pincode',
    type: 'int',
    default: 0,
  })
  pincode: number;

  @Column({
    name: 'ssn',
    type: 'int',
    default: 0,
  })
  @MaxLength(9)
  @MinLength(9)
  ssn: number;

  @Column({
    name: 'age',
    type: 'int',
    default: 0,
  })
  age: number;

  @Column({
    name: 'reference_broker_id',
    type: 'int',
    default: 0,
  })
  referenceBrokerId: number;

  @Column({
    name: 'is_active',
    default: false,
    type: 'boolean',
  })
  isActive: boolean;

  @Column({
    name: 'reset_token',
    type: 'varchar',
    default: ''
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
}
