import { Module } from '@nestjs/common';
import { LoginModule } from './modules/login/login.module';
import { ForgotPasswordModule } from './modules/forgot-password/forgot-password.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { RegisterModule } from './modules/register/register.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    LoginModule,
    ForgotPasswordModule,
    RegisterModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
  ],
})
export class AppModule {}
