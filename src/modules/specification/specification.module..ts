import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import SpecificationEntity from 'src/entities/specification.entity';
import { LoggerModule } from '../logger/logger.module';
import { SpecificationController } from './specification.controller';
import { SpecificationService } from './specification.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecificationEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecificationEntity], 'dbLocal'),
    LoggerModule,
  ],
  controllers: [SpecificationController],
  providers: [SpecificationService],
  exports: [SpecificationService],
})
export class SpecificationModule {}
