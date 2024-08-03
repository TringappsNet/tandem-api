import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendMail', () => {
    it('should sent the mail successfully', async () => {
      const email = 'test@gmail.com';
      const subject = 'test';
      const template = './template'
      const text = 'test';
      const link = 'test link';
      const option = 'test option';

      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(true);

      const result = await mailService.sendMail(
        email,
        subject,
        template,
        link,
        text,
        option,
      );

      expect(result).toBeUndefined();
      expect(mailerService.sendMail).toHaveBeenCalled();
    });
  });
});
