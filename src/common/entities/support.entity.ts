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

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'created_by',
  })
  createdBy: number;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
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
