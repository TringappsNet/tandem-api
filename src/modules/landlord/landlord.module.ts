import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { Landlord } from '../../common/entities/landlord.entity';
import { Users } from 'src/common/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Sites } from 'src/common/entities/sites.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Landlord, Users, Sites])],
  controllers: [LandlordController],
  providers: [LandlordService],
})
export class LandlordModule {}
