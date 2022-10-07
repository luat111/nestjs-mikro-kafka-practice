import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import { DefaultFormModule } from '../default-form/default-form.module.';
import { LoggerModule } from '../logger/logger.module';
import { ProductModule } from '../product/product.module.';
import { SpecificationModule } from '../specification/specification.module.';
import { SpecCateController } from './spec-category.controller';
import { SpecCateService } from './spec-category.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecCategoryEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecCategoryEntity], 'dbLocal'),
    LoggerModule,
    forwardRef(() => SpecificationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => DefaultFormModule),
  ],
  controllers: [SpecCateController],
  providers: [
    {
      provide: 'ISpecCategorySerivce',
      useClass: SpecCateService,
    },
  ],
  exports: ['ISpecCategorySerivce'],
})
export class SpecCateModule {}
