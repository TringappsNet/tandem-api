import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { Landlord } from '../../common/entities/landlord.entity';
import { Users } from 'src/common/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Landlord, Users])],
  controllers: [LandlordController],
  providers: [LandlordService],
})
export class LandlordModule {}
