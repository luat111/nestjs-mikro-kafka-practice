import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import { LoggerModule } from '../logger/logger.module';
import { SpecCateController } from './spec-category.controller';
import { SpecCateService } from './spec-category.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecCategoryEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecCategoryEntity], 'dbLocal'),
    LoggerModule
  ],
  controllers: [SpecCateController],
  providers: [SpecCateService],
  exports: [SpecCateService],
})
export class SpecCateModule {}
