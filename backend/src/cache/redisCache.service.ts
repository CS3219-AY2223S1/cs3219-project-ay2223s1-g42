import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<Type>(key: string): Promise<Type | undefined> {
    return await this.cache.get<Type>(key);
  }

  async set<Type>(key: string, value: Type): Promise<void> {
    await this.cache.set<Type>(key, value);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}