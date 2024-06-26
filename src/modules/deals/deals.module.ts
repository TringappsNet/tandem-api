import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deals } from 'src/common/entities/deals.entity';
import { Users } from 'src/common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deals, Users])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
