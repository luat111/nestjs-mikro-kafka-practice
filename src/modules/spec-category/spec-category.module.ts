import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import CategorySpecificationEntity from 'src/entities/spec_category.entity';
import { SpecCateogryController } from './spec-category.controller';
import { SpecificationCategoryService } from './spec-category.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([CategorySpecificationEntity], 'dbLocal'),
  ],
  controllers: [SpecCateogryController],
  providers: [SpecificationCategoryService],
  exports: [SpecificationCategoryService],
})
export class SpecificationCategoryModule {}
