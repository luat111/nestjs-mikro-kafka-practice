import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import CategoryEntity from 'src/entities/categories';
import ProductEntity from 'src/entities/product.entity';
import { DefaultFormModule } from '../default-form/default-form.module.';
import { ElasticSearchModule } from '../elasticsearch/elasticsearch.module';
import { KafkaModule } from '../kafka/kafka.module';
import { LoggerModule } from '../logger/logger.module';
import { SpecCateModule } from '../spec-category/spec-category.module.';
import { SpecValueModule } from '../spec-value/spec-value.module.';
import { SpecificationModule } from '../specification/specification.module.';
import { ProductCreatedListener } from './listeners/product-created.listener';
import { ProductUpdatedListener } from './listeners/product-updated.listener';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProductEntity], 'dbStaging'),
    MikroOrmModule.forFeature([ProductEntity], 'dbLocal'),
    MikroOrmModule.forFeature([CategoryEntity], 'dbStaging'),
    MikroOrmModule.forFeature([CategoryEntity], 'dbLocal'),
    KafkaModule,
    ElasticSearchModule,
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
    ProductCreatedListener,
    ProductUpdatedListener
  ],
  exports: ['IProductService'],
})
export class ProductModule {}
