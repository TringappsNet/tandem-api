import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deals } from 'src/common/entities/deals.entity';
import { Users } from 'src/common/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Deals, Users])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
