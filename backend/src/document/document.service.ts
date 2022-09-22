import { v4 } from "uuid";
import { Injectable } from "@nestjs/common";

import { NAMESPACES } from "src/cache/constants";
import { RedisCacheService } from "src/cache/redisCache.service";

@Injectable()
export class DocumentService {
  constructor(private cache: RedisCacheService) {}
}
