import { Users } from 'src/common/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('landlords')
  export class Landlord {
    @PrimaryGeneratedColumn({
      name: 'id',
      comment: 'This is a unique identifier',
    })
    id: number;
  
    @Column({
      name: 'name',
      type: 'varchar',
      length: 255,
    })
    name: string;
  
    @Column({
      name: 'phone_number',
      type: 'varchar',
      length: 15,
    })
    phoneNumber: string;
  
    @Column({
      name: 'email',
      type: 'varchar',
      length: 255,
    })
    email: string;
  
    @Column({
      name: 'address1',
      type: 'varchar',
      length: 500,
    })
    address1: string;
  
    @Column({
      name: 'address2',
      type: 'varchar',
      length: 500,
      nullable: true,
    })
    address2: string;
  
    @Column({
      name: 'city',
      type: 'varchar',
      length: 255,
    })
    city: string;

    @Column({
        name: 'state',
        type: 'varchar',
        length: 255,
      })
      state: string;
  
    @Column({
      name: 'country',
      type: 'varchar',
      length: 255,
    })
    country: string;
  
    @Column({
      name: 'zipcode',
      type: 'varchar',
      length: 10,
    })
    zipcode: string;
  
    @Column({
        name: 'created_by',
        nullable: true,
    })
    createdBy: number;

    @Column({
        nullable: true,
        name: 'updated_by',
    })
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
  