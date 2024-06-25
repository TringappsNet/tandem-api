import { Global, Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfigAsync } from '../configurations/email.config';

@Global()
@Module({
  imports: [MailerModule.forRootAsync(mailConfigAsync)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
