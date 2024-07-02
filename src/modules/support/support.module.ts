import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { Support } from 'src/common/entities/support.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/common/mail/mail.module';
import { Users } from 'src/common/entities/user.entity';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Support, Users])],
  controllers: [SupportController],
  providers: [SupportService],
})

export class SupportModule {}