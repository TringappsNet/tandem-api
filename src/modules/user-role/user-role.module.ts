import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './../../common/entities/user-role.entity';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRole]),
    forwardRef(() => RoleModule),
    forwardRef(() => AuthModule),
  ],
  providers: [],
  exports: [],
})
export class UserRoleModule {}