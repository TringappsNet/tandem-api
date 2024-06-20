/*
 * Swagger Setup
 */

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle('Tandem Infrastructure')
    .setDescription('Welcome to Tandem Infrastructure')
    .setVersion('1.0')
    .addTag('dashboard')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
