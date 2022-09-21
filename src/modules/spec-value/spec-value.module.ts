import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import SpecificationValueEntity from 'src/entities/spec_value.entity';
import { SpecValueController } from './spec-value.controller';
import { SpecificationValueService } from './spec-value.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecificationValueEntity], 'dbLocal'),
  ],
  controllers: [SpecValueController],
  providers: [SpecificationValueService],
  exports: [SpecificationValueService],
})
export class SpecificationValueModule {}
