import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import SpecificationEntity from 'src/entities/specification.entity';
import { DefaultFormModule } from '../default-form/default-form.module.';
import { LoggerModule } from '../logger/logger.module';
import { ProductModule } from '../product/product.module.';
import { SpecCateModule } from '../spec-category/spec-category.module.';
import { SpecValueModule } from '../spec-value/spec-value.module.';
import { SpecificationController } from './specification.controller';
import { SpecificationService } from './specification.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecificationEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecificationEntity], 'dbLocal'),
    LoggerModule,
    forwardRef(() => SpecCateModule),
    forwardRef(() => SpecValueModule),
    forwardRef(() => ProductModule),
    forwardRef(() => DefaultFormModule),
  ],
  controllers: [SpecificationController],
  providers: [
    {
      provide: 'ISpecificationService',
      useClass: SpecificationService,
    },
  ],
  exports: ['ISpecificationService'],
})
export class SpecificationModule {}
