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

@Entity('sites')
export class Sites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'landlord_id',
    type: 'integer',
  })
  landlordId: number;

  @Column({
    name: 'address_line1',
    type: 'varchar',
    length: 255,
  })
  addressline1: string;

  @Column({
    name: 'address_line2',
    type: 'varchar',
    length: 255,
  })
  addressline2: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  state: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  zipcode: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  country: string;

  // @ManyToOne(() => Users, (user) => user.createdSites)
  // @JoinColumn({
  //   name: 'created_by',
  // })
  // createdBy: Users;

  @Column({ name: 'created_by' })
  createdBy: number;

  // @ManyToOne(() => Users, (user) => user.updatedSites)
  // @JoinColumn({
  //   name: 'updated_by',
  // })
  // updatedBy: Users;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

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
