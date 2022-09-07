import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<Type>(key: string): Promise<Type> {
    return await this.cache.get<Type>(key);
  }

  async set<Type>(key: string, value: Type) {
    await this.cache.set<Type>(key, value);
  }
}
