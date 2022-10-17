import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import SpecValueEntity from 'src/entities/spec-value.entity';
import { DefaultFormModule } from '../default-form/default-form.module.';
import { LoggerModule } from '../logger/logger.module';
import { ProductModule } from '../product/product.module.';
import { SpecificationModule } from '../specification/specification.module.';
import { SpecValueController } from './spec-value.controller';
import { SpecValueService } from './spec-value.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecValueEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecValueEntity], 'dbLocal'),
    LoggerModule,
    forwardRef(() => SpecificationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => DefaultFormModule),
  ],
  controllers: [SpecValueController],
  providers: [
    {
      provide: 'ISpecValueService',
      useClass: SpecValueService,
    },
  ],
  exports: ['ISpecValueService'],
})
export class SpecValueModule {}
