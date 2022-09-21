import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import SpecificationEntity from 'src/entities/spec.entity';
import { SpecificationController } from './Specification.controller';
import { SpecificationService } from './specification.service';

@Module({
  imports: [MikroOrmModule.forFeature([SpecificationEntity], 'dbLocal')],
  controllers: [SpecificationController],
  providers: [SpecificationService],
  exports: [SpecificationService],
})
export class SpecificationModule {}
