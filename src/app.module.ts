import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { RoleModule } from './modules/user-role/role/role.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { DealsModule } from './modules/deals/deals.module';
import { BrokerModule } from './modules/broker/broker.module';
import { SupportModule } from './modules/support/support.module';
import { LandlordModule } from './modules/landlord/landlord.module';
import { SitesModule } from './modules/sites/sites.module';
import { ClsModule } from 'nestjs-cls';
// import { ChangeAuditSubscriber } from './common/subscribers/ChangeAudit.subscriber';
// import { AuditLogModule } from './common/methods/audit-log/audit-log.module';
import { DealsHistory } from './common/entities/deals.history.entity';

@Module({
  imports: [
    AuthModule,
    MailModule,
    RoleModule,
    UserRoleModule,
    DealsModule,
    BrokerModule,
    SupportModule,
    SitesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    LandlordModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    // AuditLogModule,
    // TypeOrmModule.forFeature([DealsHistory]),
  ],
  // providers: [ChangeAuditSubscriber],
})
export class AppModule {}
