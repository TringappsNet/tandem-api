import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deals } from 'src/common/entities/deals.entity';
import { Users } from 'src/common/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfigAsync } from 'src/common/configurations/email.config';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Deals, Users]), 
    MailerModule.forRootAsync(mailConfigAsync)
  ],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
