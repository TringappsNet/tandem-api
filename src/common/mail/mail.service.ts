import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

  async sendMail(email, subject, text) {

    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      text: text,
    });
  }
}
