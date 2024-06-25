import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { RoleModule } from './modules/user-role/role/role.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DealsModule } from './modules/deals/deals.module';
import { BrokerModule } from './modules/broker/broker.module';


@Module({
  imports: [
    AuthModule,
    MailModule,
    RoleModule,
    UserRoleModule,
    DashboardModule,
    DealsModule,
    BrokerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
  ],
})
export class AppModule {}
