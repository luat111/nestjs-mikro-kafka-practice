import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import ProductEntity from 'src/entities/product.entity';
import { LoggerModule } from '../logger/logger.module';
import { ElasticSearchController } from './elasticsearch.controller';
import { ElasticSearchService } from './elasticsearch.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProductEntity], 'dbStaging'),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        headers: { 'content-type': 'application/json' },
        node: configService.get<string>('es.es_node'),
        auth: {
          username: configService.get<string>('es.es_user'),
          password: configService.get<string>('es.es_pwd'),
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule
  ],
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
