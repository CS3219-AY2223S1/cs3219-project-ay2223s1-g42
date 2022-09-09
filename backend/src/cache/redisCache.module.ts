import { Module, CacheModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as redisStore from "cache-manager-ioredis";
import { RedisCacheService } from "./redisCache.service";

@Module({ 
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get("REDIS_HOST"),
        port: configService.get("REDIS_PORT"),
        ttl: configService.get("CACHE_TTL"),
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
