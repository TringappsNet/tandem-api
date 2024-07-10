import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';
import { UserRole } from 'src/common/entities/user-role.entity';
import { Deals } from 'src/common/entities/deals.entity';
import { Role } from 'src/common/entities/role.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Users, UserRole, Deals, Role])],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
