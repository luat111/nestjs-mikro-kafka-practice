import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ProductEntity from 'src/entities/product.entity';
import { SpecificationValueModule } from '../spec-value/spec-value.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.serivce';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProductEntity], 'dbStaging'),
    MikroOrmModule.forFeature([ProductEntity], 'dbLocal'),
    SpecificationValueModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
