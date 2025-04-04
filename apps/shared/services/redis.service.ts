import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private static client: Redis | null = null;
  private static redisEnabled = process.env.REDIS_ENABLED === 'true';

  constructor() {
    if (!RedisService.client && RedisService.redisEnabled) {
      RedisService.client = new Redis({
        host: process.env.REDIS_ENDPOINT || 'localhost',
        password: process.env.REDIS_PASSWORD || '',
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
      });

      RedisService.client.on('error', (err) => {
        console.error('❌ Redis Error:', err);
      });

      console.log('✅ Redis Connected Successfully');
    }

    if (!RedisService.client) {
      console.log('❌ Redis Not Enabled');
      return;
    }
    this.client = RedisService.client;
  }

  private client: Redis;

  async onModuleDestroy() {
    if (RedisService.client) {
      await RedisService.client.quit();
      RedisService.client = null;
      console.log('🛑 Redis Disconnected');
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (!RedisService.redisEnabled) {
        return;
      }
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, data);
      } else {
        await this.client.set(key, data);
      }
    } catch (error) {
      console.error(`❌ Redis SET Error [${key}]:`, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (!RedisService.redisEnabled) {
        return null;
      }
      const data = await this.client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`❌ Redis GET Error [${key}]:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (!RedisService.redisEnabled) {
        return;
      }
      await this.client.del(key);
    } catch (error) {
      console.error(`❌ Redis DELETE Error [${key}]:`, error);
    }
  }

  async increment(key: string): Promise<number> {
    try {
      if (!RedisService.redisEnabled) {
        return 0;
      }
      return await this.client.incr(key);
    } catch (error) {
      console.error(`❌ Redis INCR Error [${key}]:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!RedisService.redisEnabled) {
        return false;
      }
      const result = await this.client.exists(key);
      return result > 0;
    } catch (error) {
      console.error(`❌ Redis EXISTS Error [${key}]:`, error);
      return false;
    }
  }
}
