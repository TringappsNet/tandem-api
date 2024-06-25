import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deals } from 'src/common/entities/deals.entity';
import { Users } from 'src/common/entities/user.entity';
import { DealsService } from '../deals/deals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deals, Users]),
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DealsService,
  ],
})
export class DashboardModule {}
