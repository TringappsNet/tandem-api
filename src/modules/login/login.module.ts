import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
