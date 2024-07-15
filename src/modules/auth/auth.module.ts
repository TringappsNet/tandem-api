import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants/auth.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteUser } from 'src/common/entities/invite.entity';
import { MailModule } from 'src/common/mail/mail.module';
import { Users } from 'src/common/entities/user.entity';
import Session from 'src/common/entities/session.entity';
import { Role } from 'src/common/entities/role.entity';
import { UserRole } from 'src/common/entities/user-role.entity';
import { UserRoleModule } from '../user-role/user-role.module';
import { RoleModule } from '../user-role/role/role.module';
import { RoleService } from '../user-role/role/role.service';

@Module({
  imports: [
    MailModule,
    forwardRef(() => UserRoleModule), // Use forwardRef() to resolve circular dependency
    forwardRef(() => RoleModule), // Use forwardRef() to resolve circular dependency
    TypeOrmModule.forFeature([InviteUser, Users, Session, Role, UserRole]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, RoleService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
