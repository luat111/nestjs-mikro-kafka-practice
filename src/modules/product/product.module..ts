import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ProductEntity from 'src/entities/product.entity';
import { KafkaModule } from '../kafka/kafka.module';
import { LoggerModule } from '../logger/logger.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProductEntity], 'dbStaging'),
    MikroOrmModule.forFeature([ProductEntity], 'dbLocal'),
    KafkaModule,
    LoggerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
