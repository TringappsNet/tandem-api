import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [BrokerController],
  providers: [BrokerService],
})
export class BrokerModule {}
