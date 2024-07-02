import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import { seedUsers } from './common/seeds/userSeeder';
import { DataSource } from 'typeorm';
import { seedRole } from './common/seeds/roleSeeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seeder
  // 1. To add the default user record of Admin details
  // 2. To add the default role records(Admin & Broker) of Role details
  const dataSource = app.get(DataSource);
  await seedUsers(dataSource);
  await seedRole(dataSource);

  // Swagger configuration
  setupSwagger(app);

  // Enabled the CORS
  app.enableCors();

  await app.listen(3009);
  console.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}/api`,
  );
}

bootstrap();
