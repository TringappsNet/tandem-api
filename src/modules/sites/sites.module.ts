import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { Sites } from 'src/common/entities/sites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sites])],

  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
