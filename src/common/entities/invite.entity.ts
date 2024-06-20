import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('invite')
  export class InviteUser {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
  
    @Column({ name: 'email', unique: true })
    email: string;
  
    @Column({ name: 'role_id' })
    roleId: number;
  
    @Column({ name: 'invite_token' })
    inviteToken: string;
  
    @Column({ name: 'invite_token_expires', type: 'timestamp' })
    inviteTokenExpires: Date;
  
    @Column({ name: 'invited_by' })
    invitedBy: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}