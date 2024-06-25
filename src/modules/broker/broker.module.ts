import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';
import { UserRole } from 'src/common/entities/user-role.entity';
import { Deals } from 'src/common/entities/deals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserRole, Deals])],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
