import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { LoggerService } from '../logger/logger.service';
import { ICachingService } from './interface/caching.interface';

@Injectable()
export class CacheManagerService implements ICachingService {
  private callingMaps: Map<string, Promise<unknown>> = new Map();
  constructor(
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER)
    private readonly redis: Cache,
  ) {
    this.logger.setContext(CacheManagerService.name);
  }

  async get<T>(key: string): Promise<T> {
    try {
      return await this.redis.get(key);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async set<T>(key: string, value: string | T, ttl?: number) {
    try {
      await this.redis.set(key, value, ttl);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async delete(key: string) {
    try {
      await this.redis.del(key);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getOrSet<T>(
    key: string,
    getData: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    let value: T = (await this.get(key)) as T;

    if (value === null) {
      if (this.callingMaps.has(key)) {
        return this.callingMaps.get(key) as Promise<T>;
      }
      try {
        const promise = getData();

        this.callingMaps.set(key, promise);
        value = await promise;
      } finally {
        this.callingMaps.delete(key);
      }

      if (ttl && ttl > 0) {
        await this.set(key, value, ttl);
      } else {
        await this.set(key, value);
      }
    }

    return value;
  }
}
