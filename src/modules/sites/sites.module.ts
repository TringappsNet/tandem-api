import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { Sites } from 'src/common/entities/sites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/common/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Sites, Users])],
  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
