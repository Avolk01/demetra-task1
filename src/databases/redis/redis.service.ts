import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: +this.configService.get('REDIS_HOST_PORT'),
    });
  }

  async set(key: string, value: string): Promise<void> {
    this.logger.log('Redis set value');
    await this.redisClient.set(key, value, 'EX', 30);
  }

  async get(key: string): Promise<string | null> {
    this.logger.log('Redis get value');
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    this.logger.log('Redis delete value');
    await this.redisClient.del(key);
  }
}
