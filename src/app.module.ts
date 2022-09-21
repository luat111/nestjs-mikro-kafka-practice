import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configurations from './config/configurations';

import { DatabaseModule } from './modules/database/database.module';
import { ProductModule } from './modules/product/product.module';
import { SpecificationCategoryModule } from './modules/spec-category/spec-category.module';
import { SpecificationModule } from './modules/spec/specification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    DatabaseModule,
    ProductModule,
    SpecificationModule,
    SpecificationCategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
