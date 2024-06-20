import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
