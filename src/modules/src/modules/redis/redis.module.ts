import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOptions } from 'redis';
import { LoggerModule } from '../logger/logger.module';
import { CacheManagerService } from './cache-manager.service';
import { RedisService } from './redis.service';

@Module({
  imports: [
    LoggerModule,
    CacheModule.registerAsync<ClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: 5,
        store: redisStore,
        host: configService.get<string>('redis.host'),
        password: configService.get<string>('redis.pwd'),
        port: configService.get<string>('redis.port'),
        isGlobal: true,
      }),
    }),
  ],
  providers: [
    {
      provide: 'ICachingService',
      useClass: CacheManagerService,
      // useClass: RedisService,
    },
  ],
  exports: ['ICachingService'],
})
export class RedisModule {}
