import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginModule } from '../login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants/auth.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteUser } from 'src/common/entities/invite.entity';
import { MailModule } from 'src/common/mail/mail.module';
import { Users } from 'src/common/entities/user.entity';
import Session from 'src/common/entities/session.entity';
import { Role } from 'src/common/entities/role.entity';

@Module({
  imports: [
    LoginModule,
    MailModule,
    TypeOrmModule.forFeature([InviteUser, Users, Session, Role]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
