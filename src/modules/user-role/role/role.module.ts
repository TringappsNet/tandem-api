import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '../../../common/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoggerModule } from '@logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
