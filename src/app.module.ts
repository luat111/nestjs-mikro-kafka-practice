import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configurations from './config/configurations';

import { DatabaseModule } from './modules/database/database.module';
import { ProductModule } from './modules/product/product.module.';
import { SpecCateModule } from './modules/spec-category/spec-category.module.';
import { SpecValueModule } from './modules/spec-value/spec-value.module.';
import { SpecificationModule } from './modules/specification/specification.module.';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
