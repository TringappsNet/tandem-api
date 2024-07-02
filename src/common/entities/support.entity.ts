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

@Entity('support')
export class Support {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'This is a unique identifier',
  })
  id: number;

  @Column({
    name: 'ticket_subject',
    type: 'varchar',
  })
  ticketSubject: string;

  @Column({
    name: 'ticket_description',
    type: 'varchar',
  })
  ticketDescription: string;

  @Column({
    name: 'ticket_status',
    type: 'varchar',
    default: 'open',
  })
  ticketStatus: string;

  @Column({
    name: 'ticket_priority',
    type: 'varchar',
    default: 'normal',
  })
  ticketPriority: string;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({
    name: 'created_by',
  })
  createdBy: Users;

  @ManyToOne(() => Users, (user) => user.id)
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
