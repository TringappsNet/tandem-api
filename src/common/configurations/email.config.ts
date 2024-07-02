import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailConfigAsync = {
  // imports: [ConfigModule], // import module if not enabled globally
  useFactory: async (configService: ConfigService) => ({
    // transport: config.get("MAIL_TRANSPORT"),
    // or
    transport: {
      host: configService.get('MAIL_HOST'),
      secure: false,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
      to: `"No Reply" <${configService.get('MAIL_FROM')}>`,
    },
    template: {
      dir: join('src/common/mail', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};
