import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import ProductEntity from 'src/entities/product.entity';
import { DefaultFormModule } from '../default-form/default-form.module.';
import { KafkaModule } from '../kafka/kafka.module';
import { LoggerModule } from '../logger/logger.module';
import { SpecCateModule } from '../spec-category/spec-category.module';
import { SpecValueModule } from '../spec-value/spec-value.module';
import { SpecificationModule } from '../specification/specification.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProductEntity], 'dbStaging'),
    MikroOrmModule.forFeature([ProductEntity], 'dbLocal'),
    KafkaModule,
    LoggerModule,
    forwardRef(() => DefaultFormModule),
    forwardRef(() => SpecCateModule),
    forwardRef(() => SpecValueModule),
    forwardRef(() => SpecificationModule),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
  ],
  exports: ['IProductService'],
})
export class ProductModule {}
