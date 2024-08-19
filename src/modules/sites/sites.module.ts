import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { Sites } from '../../common/entities/sites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Deals } from 'src/common/entities/deals.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Sites, Users, Deals])],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
