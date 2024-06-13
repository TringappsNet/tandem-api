import { Module } from '@nestjs/common';
import { LoginModule } from './modules/login/login.module';
import { ForgotPasswordModule } from './modules/forgot-password/forgot-password.module';

@Module({
  imports: [LoginModule, ForgotPasswordModule],
})

export class AppModule {}