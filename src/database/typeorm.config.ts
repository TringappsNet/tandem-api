import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as glob from 'glob';
import * as path from 'path';

function getEntitiesPath(): string[] {
  return glob.sync(path.join(__dirname, '/../**/*.entity.ts'));
}

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT') || 3306,
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  // name: process.env.DATABASE_NAME,
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};

/*
 * This is a direct configuration without using of .env variables.
 * Uncomment the below lines for testing and debugging with hardcode config.
 */
// import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// export const typeOrmConfig: TypeOrmModuleOptions = {
//     type: 'mysql',
//     host: 'localhost',
//     port: 3306,
//     username: 'username',
//     password: 'password',
//     database: 'backend',
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     synchronize: true,
//     logging: true
// }
