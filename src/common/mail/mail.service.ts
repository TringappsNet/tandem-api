import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    email: string,
    subject: string,
    link: string,
    text: string,
    option: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './common',
      context: {
        invite_link: link,
        text: text,
        option: option,
      },
    });
  }

  async supportMail(
    name: string,
    senderMail: string,
    subject: string,
    text: string,
  ) {
    await this.mailerService.sendMail({
      to: senderMail,
      subject: subject,
      template: './support',
      context: {
        name: name,
      },
    });

    await this.mailerService.sendMail({
      subject: subject,
      template: './newTicket',
      context: {
        name: 'Admin',
        username: name,
        email: senderMail,
        subject: subject,
        message: text,
      },
    });
  }

  async dealsMail(
    email: string,
    subject: string,
    context: any,
    mailTemplate: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: mailTemplate,
      context: {
        ...context,
      },
    });
  }

  async promotionalMail(
    email: string[],
    subject: string,
    context: any,
    mailTemplate: string,
  ) {
    await this.mailerService.sendMail({
      // sender: 'tandeminfrastructure@gmail.com',
      bcc: email,
      subject: subject,
      template: mailTemplate,
      context: {
        ...context,
      },
    });
  }
}
