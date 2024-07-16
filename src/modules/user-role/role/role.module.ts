import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '../../../common/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => AuthModule)],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
