import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { LoggerService } from '../logger/logger.service';
import { ICachingService } from './interface/caching.interface';
export type RedisClientType = ReturnType<typeof createClient>;

@Injectable()
export class RedisService
  implements ICachingService, OnModuleInit, OnApplicationShutdown
{
  private redisClient: RedisClientType;
  private callingMaps: Map<string, Promise<unknown>> = new Map();
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(RedisService.name);
  }

  async onModuleInit() {
    this.redisClient = this.getInstance();
    this.redisClient.on('error', (err) =>
      this.logger.error(`Redis Error: ${err}`),
    );
    this.redisClient.on('connect', () => this.logger.log('Redis connected'));
    this.redisClient.on('reconnecting', () =>
      this.logger.warn('Redis reconnecting'),
    );
    this.redisClient.on('ready', () => {
      this.logger.log('Redis is ready!');
    });
    // await this.redisClient.connect();
  }

  async onApplicationShutdown() {
    await this.redisClient.disconnect();
  }

  createInstance(): RedisClientType {
    try {
      const instance = createClient({
        url: `redis://:${this.config.get<string>(
          'redis.pwd',
        )}@${this.config.get<string>('redis.host')}:${this.config.get<string>(
          'redis.port',
        )}`,
      });

      return instance;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  getInstance(): RedisClientType {
    if (!this.redisClient) this.redisClient = this.createInstance();
    return this.redisClient;
  }

  async set<T>(key: string, value: string | T, ttl?: number) {
    try {
      await this.redisClient.set(key, value, {
        EX: ttl || 5,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async get<T>(key: string): Promise<T> {
    try {
      return await this.redisClient.get(key);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async delete(key: string) {
    try {
      await this.redisClient.del(key);
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
        console.log(key, this.callingMaps.get(key));

        return this.callingMaps.get(key) as Promise<T>;
      }
      try {
        const promise = getData();
        console.log(promise);

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
    console.log(value);
    return value;
  }
}
