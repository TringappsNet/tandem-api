import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Users } from './user.entity';
  import { Role } from './role.entity';
  
  @Entity({ name: 'user_role' })
  export class UserRole {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
  
    @Column({ name: 'user_id' })
    userId: number;
  
    @Column({ name: 'role_id' })
    roleId: number;
  
    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: Users;
  
    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role_id' })
    role: Role;
  }
  