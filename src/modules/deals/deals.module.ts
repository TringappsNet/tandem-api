import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deals } from 'src/common/entities/deals.entity';
import { Users } from 'src/common/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfigAsync } from 'src/common/configurations/email.config';
import { DealsHistory } from 'src/common/entities/deals.history.entity';
import { Sites } from 'src/common/entities/sites.entity';
import { SitesService } from '../sites/sites.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Deals, Users, DealsHistory, Sites]),
    MailerModule.forRootAsync(mailConfigAsync),
  ],
  controllers: [DealsController],
  providers: [DealsService, SitesService],
})
export class DealsModule {}
