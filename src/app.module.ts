import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configurations from './config/configurations';
import { AuthModule } from './modules/auth/auth.module';

import { DatabaseModule } from './modules/database/database.module';
import { DefaultFormModule } from './modules/default-form/default-form.module.';
import { ElasticSearchModule } from './modules/elasticsearch/elasticsearch.module';
import { ProductModule } from './modules/product/product.module';
import { RedisModule } from './modules/redis/redis.module';
import { SpecCateModule } from './modules/spec-category/spec-category.module';
import { SpecValueModule } from './modules/spec-value/spec-value.module';
import { SpecificationModule } from './modules/specification/specification.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    DatabaseModule,
    ProductModule,
    SpecificationModule,
    SpecCateModule,
    SpecValueModule,
    DefaultFormModule,
    AuthModule,
    ElasticSearchModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
